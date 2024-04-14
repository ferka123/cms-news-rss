"use server";

import { db } from "../db";

export const getTagAutocomplete = async (value: string) => {
  if (typeof value !== "string") return [];
  console.log("fuck");

  return db.tag
    .findMany({
      select: { name: true },
      take: 15,
      where: { name: { startsWith: value, mode: "insensitive" } },
    })
    .then((tags) => tags.map(({ name }) => ({ label: name, value: name })));
};
