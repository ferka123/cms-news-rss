import { z } from "zod";

export const OptionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export type Option = z.infer<typeof OptionSchema>;
