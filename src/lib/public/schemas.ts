import { z } from "zod";
import { SearchParamsSchema } from "../common/search-params";

export const mainPageSearchParams = SearchParamsSchema.pick({ page: true });
export const searchPageSearchParams = SearchParamsSchema.pick({
  page: true,
}).merge(z.object({ q: z.string().default("").catch("") }));

export const filterPageSearchParams = SearchParamsSchema.pick({
  page: true,
}).merge(
  z.object({ tag: z.coerce.number().nullable().default(null).catch(null) })
);
