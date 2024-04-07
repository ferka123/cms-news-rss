import { z } from "zod";

export const MultipleIdSchema = z.object({
  ids: z.array(z.number().int()).min(1),
});

export const UpdateStatusSchema = MultipleIdSchema.merge(
  z.object({ paused: z.boolean() })
);
