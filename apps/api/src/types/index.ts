import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  // === Bindings ===
  DB: D1Database;

  // === Environment Variables ===
  WEB_URL_DEV: string;
  WEB_URL_PROD: string;

  GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: string;
  GOOGLE_CLOUD_PROJECT_ID: string;
  GEMINI_API_KEY: string;
}

export const DIFFICULTY = ['EASY', 'NORMAL', 'HARD'] as const;
export type Difficulty = (typeof DIFFICULTY)[number];
