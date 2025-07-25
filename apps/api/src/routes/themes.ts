import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';

import * as schema from '../db/schema';
import type { Env } from '../types';
import { DIFFICULTY } from '../types';

const ThemeSchema = z.object({
  id: z.number().openapi({
    example: 1,
    description: 'お題のID',
  }),
  difficulty: z.enum(DIFFICULTY).openapi({
    example: 'EASY',
    description: '難易度レベル',
  }),
  theme: z.string().openapi({
    example: '赤いコップ',
    description: 'お題の内容',
  }),
});

const ThemesResponseSchema = z.object({
  themes: z.array(ThemeSchema).openapi({
    description: '取得されたお題の配列',
  }),
});

const ErrorResponseSchema = z.object({
  error: z.string().openapi({
    example: 'お題の取得に失敗しました',
    description: 'エラーの内容',
  }),
  message: z.string().optional().openapi({
    example: 'Database connection failed',
    description: '詳細なエラーメッセージ',
  }),
});

const app = new OpenAPIHono<{ Bindings: Env }>();

const themesRoute = createRoute({
  method: 'get',
  path: '/themes',
  request: {
    query: z.object({
      difficulty: z.enum(DIFFICULTY).openapi({
        param: {
          name: 'difficulty',
          in: 'query',
        },
        example: 'EASY',
        description: '取得したいお題の難易度レベル',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ThemesResponseSchema,
        },
      },
      description: 'お題取得成功時のレスポンス',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: '不正な難易度パラメータが指定された場合',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'サーバー内でエラーが発生した場合',
    },
  },
});

/**
 * 難易度に応じて、Cloudflare D1 のテーブルからお題をランダムに1つ取得する
 * @param difficulty 難易度レベル (EASY, NORMAL, HARD)
 * @returns お題の配列（1件）
 */
app.openapi(themesRoute, async (c) => {
  try {
    const { difficulty } = c.req.valid('query');

    const db = drizzle(c.env.DB, { schema });
    const themes = await db
      .select()
      .from(schema.themesTable)
      .where(eq(schema.themesTable.difficulty, difficulty))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return c.json({ themes }, 200);
  } catch (e) {
    return c.json(
      {
        error: 'お題の取得に失敗しました',
        message: (e as Error).message,
      },
      500,
    );
  }
});

export const themesRoutes = app;
