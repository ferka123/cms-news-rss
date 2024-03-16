import { EnvSchema } from "../env/schema";
import { validateSchema } from "../utils/validateSchema";

const schema = EnvSchema.pick({
  S3_ENDPOINT: true,
  S3_ACCESS_KEY: true,
  S3_BUCKET_NAME: true,
  S3_SECRET_KEY: true,
  S3_REGION: true,
});

export const s3Config = validateSchema(schema, process.env);
