import { PromoPlacement, PromoType } from "@prisma/client";

export const promoStateOptions = [
  { label: "Active", value: false },
  { label: "Draft", value: true },
] as const;

export const promoTypeOptions = [
  { label: "Text", value: PromoType.text },
  { label: "Image", value: PromoType.image },
  { label: "News", value: PromoType.news },
] as const;

export const promoPagePlacementOptions = [
  { label: "List and Search", value: PromoPlacement.both },
  { label: "List", value: PromoPlacement.list },
  { label: "Search", value: PromoPlacement.search },
] as const;
