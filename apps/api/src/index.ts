import { Hono } from 'hono';
import { cors } from 'hono/cors';

import type { Env } from './types';
import themesRoutes from './routes/themes';
import judgeRoutes from './routes/judge';

const app = new Hono<{ Bindings: Env }>();

/**
 * CORS 設定
 */
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

app.route('/', judgeRoutes);
app.route('/', themesRoutes);

app.get('/', (c) => c.text('Hello HunToru API!'));

export default app;
