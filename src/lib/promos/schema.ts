import { z } from "zod";
import {
  MediaSchema,
  MultipleIdSchema,
  NumericStringSchema,
  OptionWithIdSchema,
} from "../common/schemas";
import { SearchParamsSchema } from "../common/search-params";
import { Prisma, PromoPlacement, PromoType, PubState } from "@prisma/client";
import { Shirt } from "lucide-react";

const BasePromoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.nativeEnum(PromoType),
  page_placement: z.nativeEnum(PromoPlacement),
  media: MediaSchema.pick({ src: true, id: true }).nullable().optional(),
  href: z.string().url("Please enter a proper URL").optional(),
  href_text: z.string().optional(),
  text: z.string().optional(),
  news: OptionWithIdSchema.optional(),
  position_priority: NumericStringSchema,
  pagination_priority: NumericStringSchema,
  listPlacement: z.enum(["main", "tag"]).optional().default("main"),
  list_filter: z.boolean().optional(),
  search_regexp: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        try {
          new RegExp(value);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid regular expression",
      }
    ),
  draft: z.boolean(),
});

const refineSchema = <T extends Partial<z.infer<typeof BasePromoSchema>>>(
  data: T,
  ctx: z.RefinementCtx
) => {
  switch (data.type) {
    case PromoType.image:
      if (!data.media) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Media is required for image type.",
          path: ["media"],
        });
      }
      break;
    case PromoType.news:
      if (!data.news) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "News is required for news type.",
          path: ["news"],
        });
      }
      break;
    case PromoType.text:
      if (!data.text) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Text is required for text type.",
          path: ["text"],
        });
      }
      break;
  }
};

export const PromoFormSchema = BasePromoSchema.superRefine(refineSchema);
export const PromoFormUpdateSchema = BasePromoSchema.merge(
  z.object({ id: z.number().int() })
).superRefine(refineSchema);

export const UpdatePromoStatusSchema = MultipleIdSchema.merge(
  PromoFormSchema.innerType().pick({ draft: true })
);

export const PromoSettingsSchema = z.object({
  list_count: z.number().int().optional(),
  search_count: z.number().int().optional(),
});

export const PromosParamsSchema = SearchParamsSchema.merge(
  z.object({
    order: z.enum(["asc", "desc"]).optional().default("desc").catch("desc"),
    sort: z
      .enum([
        Prisma.PromoScalarFieldEnum.title,
        Prisma.PromoScalarFieldEnum.type,
        Prisma.PromoScalarFieldEnum.pub_date,
      ])
      .optional()
      .default(Prisma.PromoScalarFieldEnum.pub_date)
      .catch(Prisma.PromoScalarFieldEnum.pub_date),
    type: z
      .enum([PromoType.image, PromoType.news, PromoType.text, ""])
      .optional()
      .catch(""),
    status: z.enum(["draft", "active", ""]).optional().catch(""),
  })
);

export type PromoFormData = z.infer<typeof PromoFormSchema> & { id?: number };
export type PromoParams = z.infer<typeof PromosParamsSchema>;
export type PromoSettings = z.infer<typeof PromoSettingsSchema>;
