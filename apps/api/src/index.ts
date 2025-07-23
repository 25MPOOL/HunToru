import { D1Database } from '@cloudflare/workers-types';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import * as schema from './db/schema';
import { DIFFICULTY, type Difficulty } from './types';
import { callVisionAPI } from './vision-api';

type Bindings = {
  DB: D1Database;

  WEB_URL_DEV: string;
  WEB_URL_PROD: string;

  GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: string;
  GOOGLE_CLOUD_PROJECT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  '/*',
  cors({
    origin: (origin, c) => {
      const allowedOrigins = [c.env.WEB_URL_DEV, c.env.WEB_URL_PROD];
      if (
        allowedOrigins.includes(origin || '') ||
        origin?.endsWith('.pages.dev')
      ) {
        return origin;
      }
      return null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type'],
  }),
);

// 画像判定エンドポイント（実際のVision API使用）
app.post('/judge', async (c) => {
  try {
    const body = await c.req.json();
    const { imageData, theme } = body;

    if (!imageData || !imageData.startsWith('data:image/')) {
      return c.json({ error: 'Invalid image data' }, 400);
    }

    if (!theme || typeof theme !== 'string') {
      return c.json({ error: 'Theme is required and must be a string' }, 400);
    }

    console.log('画像を受信しました:', imageData.substring(0, 50) + '...');
    console.log('判定するお題:', theme);

    const serviceAccountKey = c.env?.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY;
    const projectId = c.env?.GOOGLE_CLOUD_PROJECT_ID;

    if (!serviceAccountKey || !projectId) {
      return c.json(
        {
          error: 'Google Cloud credentials not configured',
        },
        500,
      );
    }

    // base64データ部分のみを抽出（data:image/jpeg;base64,を除去）
    const base64Image = imageData.split(',')[1];

    // Vision API呼び出し
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
        error: 'Internal server error: ' + (e as Error).message,
      },
      500,
    );
  }
});

/**
 * 難易度の文字列が、DIFFICULTY のいずれかかどうかを判定する
 * @param value 難易度の文字列
 * @returns true false
 */
const isDifficulty = (value: unknown): value is Difficulty => {
  return (
    typeof value === 'string' &&
    (DIFFICULTY as readonly string[]).includes(value)
  );
};

/**
 * 難易度に応じて、Cloudflare D1 のテーブルからお題を取得する
 * @param difficulty 難易度の文字列
 * @returns お題の配列
 */
app.get('/themes', async (c) => {
  try {
    const difficulty = c.req.query('difficulty');

    if (!isDifficulty(difficulty)) {
      return c.json(
        { error: 'Invalid or missing difficulty query parameter' },
        400,
      );
    }

    // Drizzle を初期化
    const db = drizzle(c.env.DB, { schema });

    // 難易度に応じて、Cloudflare D1 のテーブルからお題を取得する
    const themes = await db
      .select()
      .from(schema.themesTable)
      .where(sql`${schema.themesTable.difficulty} = ${difficulty}`)
      .orderBy(sql`RANDOM()`)
      .limit(3);

    return c.json({ themes });
  } catch (e) {
    return c.json(
      { error: 'Failed to fetch themes', message: (e as Error).message },
      500,
    );
  }
});

export default app;
