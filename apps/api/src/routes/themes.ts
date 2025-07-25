import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../db/schema';
import type { Env, Difficulty } from '../types';
import { DIFFICULTY } from '../types';

const app = new Hono<{ Bindings: Env }>();

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
      return c.json({ error: '難易度のクエリパラメータが不正です' }, 400);
    }

    const db = drizzle(c.env.DB, { schema });
    const themes = await db
      .select()
      .from(schema.themesTable)
      .where(eq(schema.themesTable.difficulty, difficulty))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return c.json({ themes });
  } catch (e) {
    return c.json(
      { error: 'お題の取得に失敗しました', message: (e as Error).message },
      500,
    );
  }
});

export default app;
