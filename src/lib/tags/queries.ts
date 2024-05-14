"use server";

import { Prisma } from "@prisma/client";
import { db } from "../db";
import { cache } from "react";

export const getTagAutocomplete = async (value: string) => {
  if (typeof value !== "string") return [];

  return db.tag
    .findMany({
      select: { name: true },
      take: 15,
      where: { name: { startsWith: value, mode: "insensitive" } },
    })
    .then((tags) => tags.map(({ name }) => ({ label: name, value: name })));
};

export const getPopularTags = async (limit: number, days?: number) => {
  const order = days
    ? Prisma.sql`SUM(CASE WHEN "News"."pub_date" >= (CURRENT_DATE - ${`${days} days`}::text::interval) THEN 1 ELSE 0 END) DESC`
    : Prisma.sql`COUNT("News"."id") DESC`;

  return db.$queryRaw<{ name: string; id: number }[]>`
  SELECT "Tag"."name", "Tag"."id"
  FROM "Tag"
  LEFT JOIN "_NewsToTag" ON "Tag"."id" = "_NewsToTag"."B"
  LEFT JOIN "News" ON "_NewsToTag"."A" = "News"."id"
  WHERE "News"."pub_state" = 'active' AND ${
    days
      ? Prisma.sql`"News"."pub_date" >= (CURRENT_DATE - ${`${days} days`}::text::interval)`
      : Prisma.sql`TRUE`
  }
  GROUP BY "Tag"."id"
  ORDER BY ${order}
  LIMIT ${limit};
  `;
};

export const cachedGetPopularTags = cache(getPopularTags);

export const getTagOptionById = async (id: number) => {
  const res = await db.tag.findUnique({
    select: { id: true, name: true },
    where: { id },
  });
  if (!res) return null;
  return { value: res.id, label: res.name };
};

export const cachedGetTagOptionById = cache(getTagOptionById);
