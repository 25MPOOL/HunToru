import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { getPlatformProxy } from 'wrangler';

import * as schema from '../db/schema';
import { themesToSeed } from '../db/seed-data';

async function generateSeedLocalData() {
  try {
    const { env } = await getPlatformProxy<{ DB: D1Database }>();
    const db = drizzle(env.DB, { schema });

    const existingThemes = await db.select().from(schema.themesTable);
    if (existingThemes.length > 0) {
      console.log('DBにすでにデータが存在するため、削除します');
      await db.delete(schema.themesTable).execute();
    }

    await db.insert(schema.themesTable).values(themesToSeed).execute();
    console.log('DBにデータを追加しました');

    process.exit(0);
  } catch (e) {
    console.error('DB追加に失敗しました', e);

    process.exit(1);
  }
}

generateSeedLocalData();
