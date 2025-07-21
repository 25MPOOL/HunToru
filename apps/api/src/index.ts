import { Hono } from "hono";
import { cors } from "hono/cors";

import { callVisionAPI } from "./vision-api";

/**
 * Cloudflare Workers環境変数の型定義
 */
interface CloudflareBindings {
  FRONTEND_URL_DEV: string;
  FRONTEND_URL_PROD: string;
  API_VERSION: string;
  GOOGLE_CLOUD_PROJECT_ID: string;
  GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: string;
}

/**
 * リクエストボディの型定義
 */
interface JudgeRequest {
  image: string;
}

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use("*", async (c, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    c.env?.FRONTEND_URL_DEV,
    c.env?.FRONTEND_URL_PROD,
  ].filter(Boolean);

  return cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: false,
  })(c, next);
});

/**
 * APIサーバーが正常に起動しているかを確認
 */
app.get("/", (c) => {
  return c.json({
    message: "HunToru API is running",
    version: c.env?.API_VERSION || "v1",
    timestamp: new Date().toISOString(),
    endpoints: {
      judge: "POST /judge - Google Cloud Vision API画像判定",
    },
    // 環境変数設定確認（値は返さない）
    config: {
      hasProjectId: !!c.env?.GOOGLE_CLOUD_PROJECT_ID,
      hasServiceAccount: !!c.env?.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY,
      isConfigured: !!(
        c.env?.GOOGLE_CLOUD_PROJECT_ID &&
        c.env?.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY
      ),
    },
  });
});

/**
 * 画像判定エンドポイント
 * Issue #11の要求に対応 - Google Cloud Vision API LABEL_DETECTION
 */
app.post("/judge", async (c) => {
  try {
    // 環境変数チェック
    if (
      !c.env.GOOGLE_CLOUD_PROJECT_ID ||
      !c.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY
    ) {
      console.error("Google Cloud credentials not configured");
      return c.json(
        {
          error: "Google Cloud設定が不完全です",
          hint: "GOOGLE_CLOUD_PROJECT_ID と GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY の設定を確認してください",
        },
        500,
      );
    }

    const body: JudgeRequest = await c.req.json();
    const { image } = body;

    // リクエストデータの検証
    if (!image || typeof image !== "string") {
      return c.json(
        {
          error: "画像データが提供されていません",
          expected: "base64エンコードされた画像データが必要です",
        },
        400,
      );
    }

    // base64データの基本的な検証とクリーンアップ
    const base64Data = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    // base64の自動パディング処理
    const paddedBase64 = addBase64Padding(base64Data);

    if (!isValidBase64(paddedBase64)) {
      return c.json(
        {
          error: "無効なbase64画像データです",
          hint: "data:image/jpeg;base64,... 形式で送信してください",
        },
        400,
      );
    }

    console.log(
      `[VISION] 画像判定開始 - プロジェクト: ${c.env.GOOGLE_CLOUD_PROJECT_ID}`,
    );

    // Google Cloud Vision API呼び出し
    const visionResponse = await callVisionAPI({
      image: paddedBase64, // パディング済みのデータを使用
      projectId: c.env.GOOGLE_CLOUD_PROJECT_ID,
      serviceAccountKey: c.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY,
    });

    console.log(
      `[VISION] 画像判定完了 - ラベル数: ${visionResponse.responses[0]?.labelAnnotations?.length || 0}個`,
    );

    // Issue要求通り、Vision APIレスポンスをそのまま返却
    return c.json(visionResponse);
  } catch (error) {
    console.error("Judge endpoint error:", error);

    if (error instanceof Error) {
      // 具体的なエラーケースごとのレスポンス
      if (error.message.includes("Vision API error")) {
        return c.json(
          {
            error: "Google Vision APIでエラーが発生しました",
            details: error.message,
          },
          502,
        );
      }
      if (error.message.includes("Token exchange failed")) {
        return c.json(
          {
            error: "Google Cloud認証に失敗しました",
            hint: "サービスアカウントキーの設定を確認してください",
          },
          401,
        );
      }
      if (error.message.includes("JSON")) {
        return c.json(
          { error: "サービスアカウントキーのJSON形式が不正です" },
          400,
        );
      }
    }

    return c.json(
      {
        error: "画像処理中にエラーが発生しました",
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

/**
 * base64データに必要なパディング（=）を自動追加
 */
function addBase64Padding(base64: string): string {
  const padding = base64.length % 4;
  if (padding === 0) return base64;
  return base64 + "=".repeat(4 - padding);
}

/**
 * base64データの簡易検証
 */
function isValidBase64(str: string): boolean {
  console.log(
    `[DEBUG] base64検証開始: 長さ=${str.length}, 最初10文字="${str.substring(0, 10)}"`,
  );

  if (!str) {
    console.log(`[DEBUG] 空文字列のためfalse`);
    return false;
  }

  if (str.length % 4 !== 0) {
    console.log(
      `[DEBUG] 長さが4の倍数でないためfalse: ${str.length} % 4 = ${str.length % 4}`,
    );
    return false;
  }

  if (str.length < 4) {
    console.log(`[DEBUG] 長さが4未満のためfalse`);
    return false;
  }

  const regexTest = /^[A-Za-z0-9+/]*={0,2}$/.test(str);
  console.log(`[DEBUG] 正規表現テスト結果: ${regexTest}`);

  if (!regexTest) {
    // 不正な文字を特定
    const invalidChars = str.match(/[^A-Za-z0-9+/=]/g);
    console.log(`[DEBUG] 不正な文字発見:`, invalidChars);
  }

  return regexTest;
}

export default app;
