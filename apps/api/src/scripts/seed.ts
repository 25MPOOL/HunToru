import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { getPlatformProxy } from 'wrangler';

import type { NewTheme } from '../db/schema';
import * as schema from '../db/schema';

const themesToSeed: NewTheme[] = [
  // EASY - 属性系のお題
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

  // NORMAL - 具体的なモノ系のお題
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

  // HARD - 形容詞+モノ系のお題
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
];

async function seed() {
  console.log('Seeding database...');

  const { env } = await getPlatformProxy<{ DB: D1Database }>();
  const db = drizzle(env.DB, { schema });

  await db.insert(schema.themesTable).values(themesToSeed).execute();

  console.log('Database seeded successfully!');
}

seed();
