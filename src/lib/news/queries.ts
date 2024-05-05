import { z } from "zod";
import { db } from "../db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { NewsForm, NewsParamsSchema } from "./schema";

export const getNewsList = async (state: z.infer<typeof NewsParamsSchema>) => {
  const where: Prisma.NewsWhereInput = {};
  if (state.q) where.title = { contains: state.q, mode: "insensitive" };
  if (state.status) where.pub_state = state.status;

  const [data, count] = await db.$transaction([
    db.news.findMany({
      include: {
        author: { select: { id: true, name: true } },
        media: true,
        tags: true,
        imported_from: { select: { id: true, name: true } },
      },
      where,
      take: state.limit,
      skip: (state.page - 1) * state.limit,
      orderBy: { [state.sort]: state.order },
    }),
    db.news.count({ where }),
  ]);

  return {
    data,
    state: { ...state, totalRows: count },
  };
};

export type NewsTableData = Awaited<ReturnType<typeof getNewsList>>;

export const getNewsById = async (id: number): Promise<NewsForm> => {
  const res = await db.news.findUnique({
    include: { media: true, tags: true },
    where: { id },
  });
  if (!res) return notFound();

  return {
    ...res,
    description: res.description ?? "",
    title: res.title ?? "",
    content: res.content ?? undefined,
    tags: res.tags.map(({ name }) => ({
      label: name,
      value: name,
    })),
  };
};
