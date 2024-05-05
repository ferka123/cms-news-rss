"use server";

import { ActionError, action } from "../action-client";
import { MultipleIdSchema } from "../common/schemas";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { UpdateNewsStatusSchema, NewsSchema, NewsUpdateSchema } from "./schema";

export const deleteNews = action(MultipleIdSchema, async ({ ids }) => {
  if (ids.length === 0) throw new ActionError("No items selected");

  const rss = await db.news.findMany({ where: { id: { in: ids } } });
  if (rss.length !== ids.length)
    throw new ActionError("Some of the selected items cannot be found");

  try {
    await db.news.deleteMany({ where: { id: { in: ids } } });

    revalidatePath("/cms/news");
  } catch {
    throw new ActionError("Failed to delete selected news");
  }

  return { message: "Selected news have been deleted" };
});

export const updateNewsStatus = action(
  UpdateNewsStatusSchema,
  async ({ ids, pub_state }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    try {
      await db.news.updateMany({
        where: { id: { in: ids } },
        data: { pub_state },
      });

      revalidatePath("/cms/rss");
    } catch {
      throw new ActionError(
        `Failed to change publication state to ${pub_state}`
      );
    }

    return {
      message: `Changed publication state to ${pub_state}`,
    };
  }
);

export const createPublication = action(
  NewsSchema,
  async ({ media, tags, ...rest }): Promise<{ success: string }> => {
    try {
      await db.news.create({
        data: {
          ...rest,
          tags: tags
            ? {
                connectOrCreate: tags.map(({ value: name }) => ({
                  create: { name },
                  where: { name },
                })),
              }
            : undefined,
          media: media?.id ? { connect: { id: media.id } } : undefined,
        },
      });

      revalidatePath("/cms/news");

      return { success: "News Publication created" };
    } catch {
      throw new ActionError("Failed to create News Publication");
    }
  }
);

export const updatePublication = action(
  NewsUpdateSchema,
  async ({ media, tags, id, ...rest }): Promise<{ success: string }> => {
    try {
      await db.news.update({
        data: {
          ...rest,
          tags: tags
            ? {
                set: [],
                connectOrCreate: tags.map(({ value: name }) => ({
                  create: { name },
                  where: { name },
                })),
              }
            : undefined,
          media: media?.id
            ? { connect: { id: media.id } }
            : media === null
            ? { disconnect: true }
            : undefined,
        },
        where: { id },
      });

      revalidatePath("/cms/news");

      return { success: "News Publication updated" };
    } catch {
      throw new ActionError("Failed to update News Publication");
    }
  }
);
