"use server";

import { db } from "../db";

export const newsLoader = async (q?: string) => {
  const res = await db.news.findMany({
    select: { id: true, title: true },
    where: q ? { title: { contains: q, mode: "insensitive" } } : undefined,
    take: 10,
  });
  return res.map((n) => ({ value: n.id, label: n.title }));
};

export const tagLoader = async (q?: string) => {
  const res = await db.tag.findMany({
    select: { id: true, name: true },
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    take: 10,
  });
  return res.map((n) => ({ value: n.id, label: n.name }));
};
