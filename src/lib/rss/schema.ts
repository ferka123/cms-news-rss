import { z } from "zod";
import { OptionSchema } from "../common/schemas";
import { rssMapKeys } from "./data";
import { SearchParamsSchema } from "../common/search-params";
import { Prisma } from "@prisma/client";

export const CustomFieldsSchema = z
  .array(
    z.object({
      mapKey: z
        .string()
        .refine(
          (key) => (rssMapKeys as string[]).includes(key),
          `Key must be on of ${rssMapKeys.join(", ")}`
        ),
      rssKey: z.string().min(1, "Rss key is required"),
      attr: z.string().optional(),
    })
  )
  .nullable()
  .transform((v) => v ?? []);

export const RssFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  src: z.string().url("Please enter a valid URL"),
  interval: z.coerce.number().min(1, "Minimum interval is 1 minute"),
  paused: z.boolean(),
  should_import_tags: z.boolean(),
  custom_tags: z.array(OptionSchema).default([]),
  custom_fields: CustomFieldsSchema,
});
export type RssForm = z.infer<typeof RssFormSchema> & { id?: number };

export const RssFormUpdateSchema = RssFormSchema.partial().merge(
  z.object({ id: z.number().int() })
);

export const MultipleIdSchema = z.object({
  ids: z.array(z.number().int()).min(1),
});

export const UpdateSourceStatusSchema = MultipleIdSchema.merge(
  RssFormSchema.pick({ paused: true })
);

export const RssParamsSchema = SearchParamsSchema.merge(
  z.object({
    sort: z
      .enum([
        Prisma.RssScalarFieldEnum.name,
        Prisma.RssScalarFieldEnum.last_pub,
        Prisma.RssScalarFieldEnum.interval,
        Prisma.RssScalarFieldEnum.paused,
      ])
      .optional()
      .default(Prisma.RssScalarFieldEnum.name)
      .catch(Prisma.RssScalarFieldEnum.name),
    status: z.enum(["paused", "active", ""]).optional().catch(""),
  })
);

export type RssParams = z.infer<typeof RssParamsSchema>;
