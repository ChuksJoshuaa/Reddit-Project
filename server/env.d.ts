declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    REDIS_URL: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: string;
    NODE_ENV: string;
    MONGO_URI: string;
    DATABASE_NAME: string;
  }
}