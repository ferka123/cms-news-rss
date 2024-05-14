import { z } from "zod";
import { db } from "../db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { PromoFormData, PromoSettings, PromosParamsSchema } from "./schema";

export const getPromosList = async (
  state: z.infer<typeof PromosParamsSchema>
) => {
  const where: Prisma.PromoWhereInput = {};
  if (state.q) where.title = { contains: state.q, mode: "insensitive" };
  if (state.status) where.draft = state.status === "draft";
  if (state.type) where.type = state.type;

  const [data, count] = await db.$transaction([
    db.promo.findMany({
      include: {
        media: true,
        news: { select: { title: true, id: true } },
      },
      where,
      take: state.limit,
      skip: (state.page - 1) * state.limit,
      orderBy: { [state.sort]: state.order },
    }),
    db.promo.count({ where }),
  ]);

  return {
    data,
    state: { ...state, totalRows: count },
  };
};

export type PromoTableData = Awaited<ReturnType<typeof getPromosList>>;

export const getPromoById = async (id: number): Promise<PromoFormData> => {
  const res = await db.promo.findUnique({
    include: {
      media: true,
      news: { select: { id: true, title: true } },
    },
    where: { id },
  });
  if (!res) return notFound();

  return {
    ...res,
    title: res.title ?? "",
    search_regexp: res.search_regexp ?? undefined,
    listPlacement: "main",
    news: res.news ? { value: res.news.id, label: res.news.title } : undefined,
    pagination_priority: res.pagination_priority ?? 0,
    position_priority: res.position_priority ?? 0,
    href: res.href ?? undefined,
    href_text: res.href_text ?? undefined,
    text: res.text ?? undefined,
  };
};
