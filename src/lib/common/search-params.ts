import type { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { z } from "zod";

export const SearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1).catch(1),
  limit: z.coerce
    .number()
    .optional()
    .default(10)
    .refine((v) => [10, 20, 30].includes(v), "Should be in 10,20,30 list")
    .catch(10),
  order: z.enum(["asc", "desc"]).optional().default("asc").catch("asc"),
  q: z.string().optional().default("").catch(""),
});

export const applyParam = <T>(
  router: ReturnType<typeof useRouter>,
  current: ReadonlyURLSearchParams,
  newParam: Partial<T & z.infer<typeof SearchParamsSchema>>
) => {
  const currentParams = Object.fromEntries(current.entries());
  Object.entries(newParam).forEach(([key, value]) => {
    if (!value) delete currentParams[key];
    else currentParams[key] = String(value);
  });
  router.push(`?${new URLSearchParams(currentParams)}`);
};

export const removeParams = <T extends string>(
  router: ReturnType<typeof useRouter>,
  current: ReadonlyURLSearchParams,
  removeKeys: (keyof z.infer<typeof SearchParamsSchema> | T)[]
) => {
  const currentParams = Object.fromEntries(current.entries());
  removeKeys.forEach((key) => delete currentParams[key]);
  const params = new URLSearchParams(currentParams);
  router.push(`?${params}`);
};
