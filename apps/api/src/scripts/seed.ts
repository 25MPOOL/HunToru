import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { getPlatformProxy } from 'wrangler';

import type { NewTheme } from '../db/schema';
import * as schema from '../db/schema';

const themesToSeed: NewTheme[] = [
  // EASY - 属性系のお題（10個）
  {
    difficulty: 'EASY',
    displayText: '何か丸いものを撮ろう！',
    aiCondition: { label: 'Circle' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か光るものを撮ろう！',
    aiCondition: { label: 'Light source' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か柔らかいものを撮ろう！',
    aiCondition: { label: 'Soft' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か透明なものを撮ろう！',
    aiCondition: { label: 'Transparent' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か四角いものを撮ろう！',
    aiCondition: { label: 'Rectangle' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か金属製のものを撮ろう！',
    aiCondition: { label: 'Metal' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か白いものを撮ろう！',
    aiCondition: { label: 'White' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か小さいものを撮ろう！',
    aiCondition: { label: 'Small' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か光沢のあるものを撮ろう！',
    aiCondition: { label: 'Shiny' },
  },
  {
    difficulty: 'EASY',
    displayText: '何か平らなものを撮ろう！',
    aiCondition: { label: 'Flat' },
  },

  // NORMAL - 具体的なモノ系のお題（10個）
  {
    difficulty: 'NORMAL',
    displayText: 'コップを撮ろう！',
    aiCondition: { label: 'Cup' },
  },
  {
    difficulty: 'NORMAL',
    displayText: '本を撮ろう！',
    aiCondition: { label: 'Book' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'スプーンを撮ろう！',
    aiCondition: { label: 'Spoon' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'リモコンを撮ろう！',
    aiCondition: { label: 'Remote control' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'スマートフォンを撮ろう！',
    aiCondition: { label: 'Mobile phone' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'ペンを撮ろう！',
    aiCondition: { label: 'Pen' },
  },
  {
    difficulty: 'NORMAL',
    displayText: '時計を撮ろう！',
    aiCondition: { label: 'Clock' },
  },
  {
    difficulty: 'NORMAL',
    displayText: '椅子を撮ろう！',
    aiCondition: { label: 'Chair' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'テーブルを撮ろう！',
    aiCondition: { label: 'Table' },
  },
  {
    difficulty: 'NORMAL',
    displayText: 'ボトルを撮ろう！',
    aiCondition: { label: 'Bottle' },
  },

  // HARD - 形容詞+モノ系のお題（10個）
  {
    difficulty: 'HARD',
    displayText: '赤いコップを撮ろう！',
    aiCondition: { label: 'Cup', property: 'COLOR', value: 'RED' },
  },
  {
    difficulty: 'HARD',
    displayText: '開いている本を撮ろう！',
    aiCondition: { label: 'Book', attribute: 'open' },
  },
  {
    difficulty: 'HARD',
    displayText: '黒いスマートフォンを撮ろう！',
    aiCondition: { label: 'Mobile phone', property: 'COLOR', value: 'BLACK' },
  },
  {
    difficulty: 'HARD',
    displayText: '木製の椅子を撮ろう！',
    aiCondition: { label: 'Chair', attribute: 'wooden' },
  },
  {
    difficulty: 'HARD',
    displayText: '青いペンを撮ろう！',
    aiCondition: { label: 'Pen', property: 'COLOR', value: 'BLUE' },
  },
  {
    difficulty: 'HARD',
    displayText: '透明なボトルを撮ろう！',
    aiCondition: { label: 'Bottle', attribute: 'transparent' },
  },
  {
    difficulty: 'HARD',
    displayText: '白い時計を撮ろう！',
    aiCondition: { label: 'Clock', property: 'COLOR', value: 'WHITE' },
  },
  {
    difficulty: 'HARD',
    displayText: '金属製のスプーンを撮ろう！',
    aiCondition: { label: 'Spoon', attribute: 'metal' },
  },
  {
    difficulty: 'HARD',
    displayText: '大きなテーブルを撮ろう！',
    aiCondition: { label: 'Table', attribute: 'large' },
  },
  {
    difficulty: 'HARD',
    displayText: '閉じているリモコンを撮ろう！',
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
