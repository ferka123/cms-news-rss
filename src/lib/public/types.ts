import { Prisma, PromoPlacement, PromoType } from "@prisma/client";
import { NewsIncludeInput } from "./prisma-inputs";

export type PromoRawQuery = {
  id: number;
  type: PromoType;
  draft: boolean;
  title: string;
  position_priority: number | null;
  pagination_priority: number | null;
  search_regexp: string | null;
  href: string | null;
  href_text: string | null;
  media_id: number | null;
  news_id: number | null;
  text: string | null;
  pub_date: string;
  page_placement: PromoPlacement;
  list_filter: boolean;
  image: string | null;
  height: number | null;
  width: number | null;
};

export type NewsCard = {
  type: "news";
  news_id: number;
  image: { src: string; height: number; width: number } | null;
  title: string;
  description: string | null;
  href: string | null;
  imported_from?: string;
  author: string | null;
  tags: { name: string; id: number }[];
  pub_date: Date;
};

export type ImageCard = {
  type: "image";
  image: { src: string; height: number; width: number };
  href: string | null;
};

export type TextCard = {
  type: "text";
  text: string;
  href_text: string | null;
  href: string | null;
};

export type BaseCard = {
  card_id: string;
  isPromotion: boolean;
  position_priority?: number | null;
};

export type ContentCard = (ImageCard | TextCard | NewsCard) & BaseCard;

export type PublicNewsParams = {
  type: "main" | "filter" | "search";
  page: number;
  q?: string;
  tag?: number | null;
};

export type PublicNewsList = {
  data: ContentCard[];
  state: {
    page: number;
    totalRows: number;
    totalPages: number;
  } & PublicNewsParams;
};
