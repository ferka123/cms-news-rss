import { z } from "zod";

export const OptionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const OptionWithIdSchema = OptionSchema.merge(
  z.object({ value: z.number().int() })
);

export const MediaSchema = z.object({
  id: z.number().optional(),
  src: z.string().url(),
  width: z.number(),
  height: z.number(),
});

export const MultipleIdSchema = z.object({
  ids: z.array(z.number().int()).min(1),
});

export const MultipleStringIdSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export const NumericStringSchema = z
  .union([z.string(), z.number()])
  .optional()
  .refine((v) => typeof v === "number" || !v || Number(v), {
    message: "Must be a number",
  })
  .transform((v) => (typeof v === "number" ? v : !v ? 0 : Number(v)));

export type Option = z.infer<typeof OptionSchema>;
export type Media = z.infer<typeof MediaSchema>;
