"use server";

import { ActionError, adminAction, authAction } from "../action-client";
import { MultipleIdSchema } from "../common/schemas";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { UpdateNewsStatusSchema, NewsSchema, NewsUpdateSchema } from "./schema";

export const deleteNews = adminAction(MultipleIdSchema, async ({ ids }) => {
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

export const updateNewsStatus = authAction(
  UpdateNewsStatusSchema,
  async ({ ids, pub_state }, { session }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    if (session.user.role !== "admin") {
      if (ids.length > 1) throw new ActionError("Not authorized");

      const news = await db.news.findUnique({
        where: { id: ids[0] },
        select: { author_id: true },
      });
      if (!news) throw new ActionError("News Publication not found");
      if (news.author_id !== session.user.id)
        throw new ActionError("Not authorized");
    }

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

export const createPublication = authAction(
  NewsSchema,
  async (
    { media, tags, ...rest },
    { session }
  ): Promise<{ success: string }> => {
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
          author: { connect: { id: session.user.id } },
        },
      });

      revalidatePath("/cms/news");

      return { success: "News Publication created" };
    } catch {
      throw new ActionError("Failed to create News Publication");
    }
  }
);

export const updatePublication = authAction(
  NewsUpdateSchema,
  async (
    { media, tags, id, ...rest },
    { session }
  ): Promise<{ success: string }> => {
    try {
      const news = await db.news.findUnique({
        where: { id },
        select: { author_id: true },
      });
      if (!news) throw new ActionError("News Publication not found");
      if (news.author_id !== session.user.id)
        throw new ActionError("Not authorized");

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
