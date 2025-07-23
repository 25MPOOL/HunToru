import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

function getEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set.`);
  }

  return value;
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: getEnvVariable('CLOUDFLARE_ACCOUNT_ID'),
    databaseId: getEnvVariable('CLOUDFLARE_DATABASE_ID'),
    token: getEnvVariable('CLOUDFLARE_API_TOKEN'),
  },
});
