import { Hono } from 'hono';
import type { Env } from '../types';
import { callVisionAPI } from '../services/google/vision-api';

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

    if (!serviceAccountKey || !projectId) {
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
      projectId: projectId,
      serviceAccountKey: serviceAccountKey,
    });

    // エラーチェック
    if (visionResult.responses[0].error) {
      console.error('Vision API Error:', visionResult.responses[0].error);
      return c.json(
        {
          error: 'Vision API error: ' + visionResult.responses[0].error.message,
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
      theme: theme,
      label_score: labelScore,
      detected_labels: labels.map((label) => ({
        description: label.description,
        score: label.score,
      })),
      image_properties: imageProperties,
      message: `画像を正常に解析しました。${labels.length}個のラベルを検出。`,
    };

    return c.json(response);
  } catch (e) {
    return c.json(
      {
        error: 'エラーが発生しました: ' + (e as Error).message,
      },
      500,
    );
  }
});

export const judgeRoutes = app;
