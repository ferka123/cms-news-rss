import { z } from "zod";
import { db } from "../db";
import { RssParamsSchema } from "./schema";
import { Prisma } from "@prisma/client";

export const getRssList = async (state: z.infer<typeof RssParamsSchema>) => {
  const where: Prisma.RssWhereInput = {};
  if (state.q) where.name = { contains: state.q, mode: "insensitive" };
  if (state.status) where.paused = state.status === "paused";

  const [data, count] = await db.$transaction([
    db.rss.findMany({
      select: {
        id: true,
        name: true,
        paused: true,
        interval: true,
        last_pub: true,
      },
      where,
      take: state.limit,
      skip: (state.page - 1) * state.limit,
      orderBy: { [state.sort]: state.order },
    }),
    db.rss.count({ where }),
  ]);

  return {
    data,
    state: { ...state, totalRows: count },
  };
};

export type RssTableData = Awaited<ReturnType<typeof getRssList>>;

export const getRssById = async (id: number) => {
  return db.rss.findUnique({
    include: { custom_tags: true },
    where: { id },
  });
};
