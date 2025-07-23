import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { getPlatformProxy } from 'wrangler';

import type { NewTheme } from '../db/schema';
import * as schema from '../db/schema';

const themesToSeed: NewTheme[] = [
  // EASY - 属性系のお題（10個）
  {
    difficulty: 'EASY',
    theme: '何か丸いもの',
    aiCondition: { label: 'Circle' },
  },
  {
    difficulty: 'EASY',
    theme: '何か光るもの',
    aiCondition: { label: 'Light source' },
  },
  {
    difficulty: 'EASY',
    theme: '何か柔らかいもの',
    aiCondition: { label: 'Soft' },
  },
  {
    difficulty: 'EASY',
    theme: '何か透明なもの',
    aiCondition: { label: 'Transparent' },
  },
  {
    difficulty: 'EASY',
    theme: '何か四角いもの',
    aiCondition: { label: 'Rectangle' },
  },
  {
    difficulty: 'EASY',
    theme: '何か金属製のもの',
    aiCondition: { label: 'Metal' },
  },
  {
    difficulty: 'EASY',
    theme: '何か白いもの',
    aiCondition: { label: 'White' },
  },
  {
    difficulty: 'EASY',
    theme: '何か小さいもの',
    aiCondition: { label: 'Small' },
  },
  {
    difficulty: 'EASY',
    theme: '何か光沢のあるもの',
    aiCondition: { label: 'Shiny' },
  },
  {
    difficulty: 'EASY',
    theme: '何か平らなもの',
    aiCondition: { label: 'Flat' },
  },

  // NORMAL - 具体的なモノ系のお題（10個）
  {
    difficulty: 'NORMAL',
    theme: 'コップ',
    aiCondition: { label: 'Cup' },
  },
  {
    difficulty: 'NORMAL',
    theme: '本',
    aiCondition: { label: 'Book' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'スプーン',
    aiCondition: { label: 'Spoon' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'リモコン',
    aiCondition: { label: 'Remote control' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'スマートフォン',
    aiCondition: { label: 'Mobile phone' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'ペン',
    aiCondition: { label: 'Pen' },
  },
  {
    difficulty: 'NORMAL',
    theme: '時計',
    aiCondition: { label: 'Clock' },
  },
  {
    difficulty: 'NORMAL',
    theme: '椅子',
    aiCondition: { label: 'Chair' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'テーブル',
    aiCondition: { label: 'Table' },
  },
  {
    difficulty: 'NORMAL',
    theme: 'ボトル',
    aiCondition: { label: 'Bottle' },
  },

  // HARD - 形容詞+モノ系のお題（10個）
  {
    difficulty: 'HARD',
    theme: '赤いコップ',
    aiCondition: { label: 'Cup', property: 'COLOR', value: 'RED' },
  },
  {
    difficulty: 'HARD',
    theme: '開いている本',
    aiCondition: { label: 'Book', attribute: 'open' },
  },
  {
    difficulty: 'HARD',
    theme: '黒いスマートフォン',
    aiCondition: { label: 'Mobile phone', property: 'COLOR', value: 'BLACK' },
  },
  {
    difficulty: 'HARD',
    theme: '木製の椅子',
    aiCondition: { label: 'Chair', attribute: 'wooden' },
  },
  {
    difficulty: 'HARD',
    theme: '青いペン',
    aiCondition: { label: 'Pen', property: 'COLOR', value: 'BLUE' },
  },
  {
    difficulty: 'HARD',
    theme: '透明なボトル',
    aiCondition: { label: 'Bottle', attribute: 'transparent' },
  },
  {
    difficulty: 'HARD',
    theme: '白い時計',
    aiCondition: { label: 'Clock', property: 'COLOR', value: 'WHITE' },
  },
  {
    difficulty: 'HARD',
    theme: '金属製のスプーン',
    aiCondition: { label: 'Spoon', attribute: 'metal' },
  },
  {
    difficulty: 'HARD',
    theme: '大きなテーブル',
    aiCondition: { label: 'Table', attribute: 'large' },
  },
  {
    difficulty: 'HARD',
    theme: '閉じているリモコン',
    aiCondition: { label: 'Remote control', attribute: 'closed' },
  },
];

async function seed() {
  console.log('Seeding database...');

  const { env } = await getPlatformProxy<{ DB: D1Database }>();
  const db = drizzle(env.DB, { schema });

  await db.insert(schema.themesTable).values(themesToSeed).execute();

  console.log('Database seeded successfully!');
}

seed();
