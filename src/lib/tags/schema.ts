import { z } from "zod";

export const CreateTagSchema = z.object({
  label: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export const UpdateTagSchema = CreateTagSchema.merge(
  z.object({
    value: z.number().int(),
  })
);
