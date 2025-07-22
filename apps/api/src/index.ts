import { Hono } from "hono";
import { cors } from "hono/cors";
import { callVisionAPI } from "./vision-api";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://*.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/", (c) => {
  return c.text("Hello Hooonoooooo");
});

// 画像判定エンドポイント（実際のVision API使用）
app.post("/judge", async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, theme } = body;

    if (!imageData || !imageData.startsWith("data:image/")) {
      return c.json({ error: "Invalid image data" }, 400);
    }

    console.log("画像を受信しました:", imageData.substring(0, 50) + "...");
    console.log("お題:", theme || "未指定");

    // 環境変数からサービスアカウントキーを取得
    const serviceAccountKey = c.env?.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY;
    const projectId = c.env?.GOOGLE_CLOUD_PROJECT_ID;

    if (!serviceAccountKey || !projectId) {
      return c.json(
        {
          error: "Google Cloud credentials not configured",
        },
        500,
      );
    }

    // base64データ部分のみを抽出（data:image/jpeg;base64,を除去）
    const base64Image = imageData.split(",")[1];

    // Vision API呼び出し
    const visionResult = await callVisionAPI({
      image: base64Image,
      projectId: projectId,
      serviceAccountKey: serviceAccountKey,
    });

    // エラーチェック
    if (visionResult.responses[0].error) {
      console.error("Vision API Error:", visionResult.responses[0].error);
      return c.json(
        {
          error: "Vision API error: " + visionResult.responses[0].error.message,
        },
        500,
      );
    }

    const labels = visionResult.responses[0].labelAnnotations || [];
    const imageProperties = visionResult.responses[0].imagePropertiesAnnotation;

    // 最高スコアのラベルを取得
    const bestLabel = labels.length > 0 ? labels[0] : null;
    const labelScore = bestLabel ? bestLabel.score : 0;

    const response = {
      success: true,
      theme: theme || "テストお題",
      label_score: labelScore,
      detected_labels: labels.map((label) => ({
        description: label.description,
        score: label.score,
      })),
      image_properties: imageProperties,
      message: `画像を正常に解析しました。${labels.length}個のラベルを検出。`,
    };

    return c.json(response);
  } catch (error) {
    console.error("Judge API Error:", error);
    return c.json(
      {
        error: "Internal server error: " + (error as Error).message,
      },
      500,
    );
  }
});

export default app;
