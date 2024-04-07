import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  WEB_URL: z.string().min(1),
  WEB_PORT: z.coerce.number().default(3000),
  IMPORTER_URL: z.string().min(1),
  IMPORTER_PORT: z.coerce.number().default(5001),
  DATABASE_URL: z.string().min(1),
  INTERNAL_NETWORK_DATABASE_URL: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  S3_ENDPOINT: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
});
