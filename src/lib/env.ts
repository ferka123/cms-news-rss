import { EnvSchema } from "../../shared/env/schema";
import { validateSchema } from "../../shared/utils/validateSchema";

export const processEnv = validateSchema(EnvSchema, process.env);
