import { getPromoById } from "@/lib/promos/queries";
import { PromoFormData } from "@/lib/promos/schema";
import { PromoPlacement, PromoType } from "@prisma/client";
import { notFound } from "next/navigation";

const defaultData: PromoFormData = {
  title: "",
  type: PromoType.text,
  draft: true,
  page_placement: PromoPlacement.both,
  pagination_priority: 0,
  position_priority: 0,
  listPlacement: "main",
};

export const promoLoader = async (slug: string) => {
  const maybeId = parseInt(slug);
  const data: PromoFormData | null =
    slug === "create"
      ? defaultData
      : maybeId
      ? await getPromoById(maybeId)
      : null;

  if (!data) return notFound();

  return data;
};
