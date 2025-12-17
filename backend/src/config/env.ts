// backend/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  YT_DLP_PATH: z.string().optional(),
  FFMPEG_PATH: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  MANUS_CLIENT_ID: z.string(),
  MANUS_CLIENT_SECRET: z.string(),
  SESSION_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;