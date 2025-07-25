import { Hono } from 'hono';
import type { Env } from '../types';
import { callVisionAPI } from '../services/google/vision-api';
import {
  callGeminiAPI,
  type CallGeminiAPIParams,
  type CallGeminiAPIResponse,
} from '../services/google/gemini-api';

const app = new Hono<{ Bindings: Env }>();

/**
 * 画像を判定し、お題に対してどのくらい似ているかを判定する
 * @param c base64 の画像データとお題を受け取る
 * @returns 判定結果
 */
app.post('/judge', async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, theme } = body;

    if (!imageData || !imageData.startsWith('data:image/') || !theme) {
      return c.json({ error: 'リクエストボディが不正です' }, 400);
    }

    const serviceAccountKey = c.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY;
    const projectId = c.env.GOOGLE_CLOUD_PROJECT_ID;
    const geminiApiKey = c.env.GEMINI_API_KEY;

    if (!serviceAccountKey || !projectId || !geminiApiKey) {
      return c.json(
        {
          error: 'Google Cloud の認証情報が設定されていません',
        },
        500,
      );
    }

    const base64Image = imageData.split(',')[1];
    const visionResult = await callVisionAPI({
      image: base64Image,
      projectId,
      serviceAccountKey,
    });
    const labels =
      visionResult.responses[0].labelAnnotations?.map(
        (label) => label.description,
      ) ?? [];

    const geminiParams: CallGeminiAPIParams = {
      theme,
      labels,
      apiKey: geminiApiKey,
    };
    const judgeResult: CallGeminiAPIResponse =
      await callGeminiAPI(geminiParams);

    return c.json({
      success: true,
      theme: theme,
      score: judgeResult.score,
      reason: judgeResult.reason,
      fatnessMultiplier: 1 + judgeResult.score,
      detected_labels: labels,
    });
  } catch (e) {
    return c.json(
      { error: 'エラーが発生しました: ' + (e as Error).message },
      500,
    );
  }
});

export const judgeRoutes = app;
