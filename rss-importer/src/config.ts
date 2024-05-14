import { EnvSchema } from "../../shared/env/schema";
import { validateSchema } from "../../shared/utils/validateSchema";

const schema = EnvSchema.pick({
  IMPORTER_PORT: true,
});

export const config = validateSchema(schema, process.env);
