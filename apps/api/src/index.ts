import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';

import type { Env } from './types';
import { themesRoutes } from './routes/themes';
import { judgeRoutes } from './routes/judge';

import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono<{ Bindings: Env }>();

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

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'HunToru API',
    version: '1.0.0',
  },
});

app.get('/ui', swaggerUI({ url: '/doc' }));

export default app;
