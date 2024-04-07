import { z } from "zod";

export const baseRssItemKeys = [
  "content",
  "creator",
  "categories",
  "link",
  "media",
  "pubDate",
  "title",
] as const satisfies readonly RssItemKeys[];

export const rssItemKeys = [
  ...baseRssItemKeys,
  "contentSnippet",
  "isoDate",
] as const satisfies readonly RssItemKeys[];

export const CustomFieldSchema = z
  .array(
    z.object({
      mapKey: z.enum(baseRssItemKeys),
      rssKey: z.string(),
      attr: z.string().optional(),
    })
  )
  .nullable()
  .default([]);

const DateShema = z
  .string()
  .optional()
  .nullable()
  .refine((date) => !date || Date.parse(date) || false, {
    message: "Wrong date format",
  });

export const RssItemSchema = z.object({
  title: z.string().min(1),
  creator: z.string().min(1).optional().nullable(),
  media: z.string().url().optional().nullable(),
  link: z.string().url().optional().nullable(),
  content: z.string().min(1).optional().nullable(),
  contentSnippet: z.string().min(1).optional().nullable(),
  categories: z.array(z.string().min(1)),
  isoDate: DateShema,
  pubDate: DateShema,
});

export type RssItem = z.infer<typeof RssItemSchema>;
export type RssItemKeys = keyof RssItem;
