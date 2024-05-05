"use server";

import { ActionError, action } from "../action-client";
import { MultipleIdSchema } from "../common/schemas";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import {
  PromoFormData,
  PromoFormSchema,
  PromoFormUpdateSchema,
  UpdatePromoStatusSchema,
} from "./schema";
import { Prisma } from "@prisma/client";

export const deletePromos = action(MultipleIdSchema, async ({ ids }) => {
  if (ids.length === 0) throw new ActionError("No items selected");

  const rss = await db.promo.findMany({ where: { id: { in: ids } } });
  if (rss.length !== ids.length)
    throw new ActionError("Some of the selected items cannot be found");

  try {
    await db.promo.deleteMany({ where: { id: { in: ids } } });

    revalidatePath("/cms/promos");
  } catch {
    throw new ActionError("Failed to delete selected promos");
  }

  return { message: "Selected news have been deleted" };
});

export const updatePromoStatus = action(
  UpdatePromoStatusSchema,
  async ({ ids, draft }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    try {
      await db.promo.updateMany({
        where: { id: { in: ids } },
        data: { draft },
      });

      revalidatePath("/cms/promos");
    } catch {
      throw new ActionError(
        `Failed to change publication state to ${draft ? "draft" : "active"}`
      );
    }

    return {
      message: `Changed publication state to ${draft ? "draft" : "active"}`,
    };
  }
);

const getCreateInput = ({
  media,
  news,
  listPlacement,
  filter_tag,
  ...data
}: PromoFormData): Prisma.PromoCreateInput => {
  return {
    ...data,
    media: media?.id ? { connect: { id: media.id } } : undefined,
    news: news?.value ? { connect: { id: news.value } } : undefined,
    filter_tag: filter_tag?.value
      ? { connect: { id: filter_tag.value } }
      : undefined,
  };
};

export const createPromo = action(
  PromoFormSchema,
  async (data): Promise<{ success: string }> => {
    try {
      await db.promo.create({
        data: getCreateInput(data),
      });

      revalidatePath("/cms/promos");

      return { success: "Promo created" };
    } catch {
      throw new ActionError("Failed to create Promo");
    }
  }
);

export const updatePromo = action(
  PromoFormUpdateSchema,
  async ({ id, ...data }): Promise<{ success: string }> => {
    try {
      const input: Prisma.PromoUpdateInput = getCreateInput(data);
      if (data.media === null) input.media = { disconnect: true };

      await db.promo.update({
        data: input,
        where: { id },
      });

      revalidatePath("/cms/promos");

      return { success: "Promo updated" };
    } catch (e) {
      console.error(e);
      throw new ActionError("Failed to update Promo");
    }
  }
);
