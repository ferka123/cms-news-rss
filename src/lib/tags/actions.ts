"use server";

import { z } from "zod";
import { ActionError, adminAction } from "../action-client";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateTagSchema, UpdateTagSchema } from "./schema";

export const deleteTag = adminAction(z.number().int(), async (id) => {
  try {
    await db.tag.delete({ where: { id } });
    revalidatePath("/cms/tags");
  } catch {
    throw new ActionError("Failed to delete tag");
  }

  return { message: "Tag has been deleted" };
});

export const createTag = adminAction(CreateTagSchema, async (tag) => {
  try {
    const data = await db.tag.create({ data: { name: tag.label } });
    revalidatePath("/cms/tags");

    return { label: data.name, value: data.id };
  } catch {
    throw new ActionError("Failed to create tag");
  }
});

export const updateTag = adminAction(UpdateTagSchema, async (tag) => {
  try {
    const data = await db.tag.update({
      data: { name: tag.label },
      where: { id: tag.value },
    });
    revalidatePath("/cms/tags");
    return { label: data.name, value: data.id };
  } catch {
    throw new ActionError("Failed to update tag");
  }
});
