"use server";

import { redirect } from "next/navigation";
import { ActionError, action } from "../action-client";
import { db } from "../db";
import {
  removeImporterSource,
  updateImporterSource,
  updateImporterStatus,
} from "./importer-api";
import {
  MultipleIdSchema,
  RssFormSchema,
  RssFormUpdateSchema,
  UpdateSourceStatusSchema,
} from "./schema";
import { revalidatePath } from "next/cache";

export const deleteSources = action(MultipleIdSchema, async ({ ids }) => {
  if (ids.length === 0) throw new ActionError("No items selected");

  const rss = await db.rss.findMany({ where: { id: { in: ids } } });
  if (rss.length !== ids.length)
    throw new ActionError("Some of the selected items cannot be found");

  try {
    await db.$transaction(async (tx) => {
      await tx.rss.deleteMany({ where: { id: { in: ids } } });
      await removeImporterSource(ids);
    });

    revalidatePath("/cms/rss");
  } catch {
    throw new ActionError("Failed to delete selected sources");
  }

  return { message: "Selected sources have been deleted" };
});

export const updateSourceStatus = action(
  UpdateSourceStatusSchema,
  async ({ ids, paused }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    try {
      await db.$transaction(async (tx) => {
        await tx.rss.updateMany({
          where: { id: { in: ids } },
          data: { paused },
        });
        await updateImporterStatus(ids, paused);
      });

      revalidatePath("/cms/rss");
    } catch {
      throw new ActionError(
        `Failed to ${paused ? "pause" : "resume"} selected sources`
      );
    }

    return {
      message: `Selected sources have been ${paused ? "paused" : "resumed"}`,
    };
  }
);

export const createSource = action(
  RssFormSchema,
  async ({ custom_tags, ...rest }) => {

    try {
      const result = await db.rss.create({
        data: {
          ...rest,
          custom_tags: {
            connectOrCreate: custom_tags.map(({ value: name }) => ({
              create: { name },
              where: { name },
            })),
          },
        },
      });

      await updateImporterSource(result.id).catch(() => {
        console.error(`Failed to update rss source ${result.id} on rss worker`);
      });

      revalidatePath("/cms/rss");

      return { success: "Rss Source created" };
    } catch {
      throw new ActionError("Failed to create Rss Source");
    }
  }
);

export const updateSource = action(
  RssFormUpdateSchema,
  async ({ id, custom_tags, ...rest }) => {
    try {
      const result = await db.rss.update({
        data: {
          ...rest,
          custom_tags: custom_tags
            ? {
                set: [],
                connectOrCreate: custom_tags.map(({ value: name }) => ({
                  create: { name },
                  where: { name },
                })),
              }
            : undefined,
        },
        where: { id },
      });

      await updateImporterSource(result.id).catch(() => {
        console.error(`Failed to update rss source ${result.id} on rss worker`);
      });

      revalidatePath("/cms/rss");
      revalidatePath(`/cms/rss/${id}`);

      return { success: "Rss Source updated" };
    } catch {
      throw new ActionError("Failed to update Rss Source");
    }
  }
);
