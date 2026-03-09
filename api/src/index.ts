import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { authRoutes } from './cf/routes/auth';
import { certificateRoutes } from './cf/routes/certificates';
import { settingsRoutes } from './cf/routes/settings';
import { uploadRoutes } from './cf/routes/uploads';

export type Env = {
  Bindings: {
    DB: D1Database;
    UPLOADS: R2Bucket;
    JWT_SECRET: string;
    R2_PUBLIC_URL?: string;
  };
  Variables: {
    userId: string;
    userEmail: string;
    validatedJson: unknown;
    validatedForm: Record<string, unknown>;
  };
};

const app = new Hono<Env>({ strict: false });

app.use('*', cors());

app.get('/status', (c) => c.json({ message: 'API running on Cloudflare Worker' }));

app.route('/', authRoutes);
app.route('/', certificateRoutes);
app.route('/', settingsRoutes);
app.route('/', uploadRoutes);

app.notFound((c) => c.json({ error: true, message: '404 not found' }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      error: true,
      message: 'Internal server error',
      details: err instanceof Error ? err.message : String(err),
    },
    500
  );
});

export default app;
