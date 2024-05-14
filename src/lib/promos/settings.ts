"use server";

import { revalidatePath } from "next/cache";
import { ActionError, action } from "../action-client";
import { db } from "../db";
import { PromoSettings, PromoSettingsSchema } from "./schema";

let promoSettingsCache = null as PromoSettings | null;

export const getPromoSettings = async (): Promise<PromoSettings> => {
  if (!promoSettingsCache) {
    const res = await db.promoSettings.findUnique({
      select: { list_count: true, search_count: true },
      where: { id: 1 },
    });

    promoSettingsCache = res || { list_count: 0, search_count: 0 };

    return promoSettingsCache;
  } else {
    return { ...promoSettingsCache };
  }
};

export const setPromoSettings = action(PromoSettingsSchema, async (data) => {
  try {
    await db.promoSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    promoSettingsCache = data;
    revalidatePath("/cms/promos");

    return {
      message: "Promo settings updated successfully.",
    };
  } catch {
    throw new ActionError(
      `Failed to update promo settings. Please try again later.`
    );
  }

  return {
    message: "Promo settings updated successfully.",
  };
});
