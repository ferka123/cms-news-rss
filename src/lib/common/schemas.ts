import { z } from "zod";

export const OptionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

export const MediaSchema = z.object({
  id: z.number().optional(),
  src: z.string().url(),
  width: z.number(),
  height: z.number(),
});

export const MultipleIdSchema = z.object({
  ids: z.array(z.number().int()).min(1),
});

export type Option = z.infer<typeof OptionSchema>;
export type Media = z.infer<typeof MediaSchema>;
