export type Env = {
  Bindings: {
    DB: D1Database;
    UPLOADS: R2Bucket;
    JWT_SECRET: string;
    R2_PUBLIC_URL?: string;
    CORS_ALLOWED_ORIGINS?: string;
    DEFAULT_ADMIN_EMAIL?: string;
    DEFAULT_ADMIN_PASSWORD?: string;
    SEED_SAMPLE_DATA?: string;
    NODE_ENV?: string;
    APP_ENV?: string;
  };
  Variables: {
    userId: string;
    userEmail: string;
    validatedJson: unknown;
    validatedForm: Record<string, unknown>;
  };
};
