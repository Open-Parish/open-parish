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
