import { z } from "zod";
import { MediaSchema, MultipleIdSchema, OptionSchema } from "../common/schemas";
import { SearchParamsSchema } from "../common/search-params";
import { Prisma, PubState } from "@prisma/client";

export const NewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Publication description is required"),
  content: z.string().optional(),
  tags: z.array(OptionSchema).default([]),
  pub_state: z.nativeEnum(PubState),
  media: MediaSchema.pick({ src: true, id: true }).nullable().optional(),
});

export const NewsSchemaUpdateSchema = NewsSchema.partial().merge(
  z.object({ id: z.number().int() })
);

export type NewsForm = z.infer<typeof NewsSchema> & { id?: number };

export const NewsUpdateSchema = NewsSchema.partial().merge(
  z.object({ id: z.number().int() })
);

export const UpdateNewsStatusSchema = MultipleIdSchema.merge(
  NewsSchema.pick({ pub_state: true })
);

export const NewsParamsSchema = SearchParamsSchema.merge(
  z.object({
    order: z.enum(["asc", "desc"]).optional().default("desc").catch("desc"),
    sort: z
      .enum([
        Prisma.NewsScalarFieldEnum.title,
        Prisma.NewsScalarFieldEnum.pub_date,
        Prisma.NewsScalarFieldEnum.pub_state,
      ])
      .optional()
      .default(Prisma.NewsScalarFieldEnum.pub_date)
      .catch(Prisma.NewsScalarFieldEnum.pub_date),
    status: z
      .enum([
        PubState.active,
        PubState.deleted,
        PubState.draft,
        PubState.hidden,
        "",
      ])
      .optional()
      .catch(""),
    author: z.enum(["mine", ""]).optional().catch(""),
  })
);

export type NewsParams = z.infer<typeof NewsParamsSchema>;
