import { z } from "zod";

export const validateSchema = <T extends z.ZodSchema>(
  schema: T,
  data: unknown
): z.infer<T> => schema.parse(data);
