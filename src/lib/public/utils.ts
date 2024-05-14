import { NewsPayload } from "./prisma-inputs";
import {
  BaseCard,
  ContentCard,
  ImageCard,
  NewsCard,
  PromoRawQuery,
  TextCard,
} from "./types";

export const mapPrismaPayloadToNewsCard = (
  news: NewsPayload,
  isPromotion: boolean,
  card_id: string,
  position_priority?: number | null
): ContentCard => {
  return {
    card_id,
    isPromotion,
    position_priority,
    type: "news",
    news_id: news.id,
    image: news.media,
    title: news.title,
    description: news.description,
    author: news.author?.name ?? news.external_author ?? null,
    tags: news.tags,
    href: news.external_link,
    imported_from: news.imported_from?.name,
    pub_date: news.pub_date,
  };
};

export const mapPromoRawToTextCard = (
  promo: PromoRawQuery
): ContentCard | null => {
  if (!promo.text) return null;
  return {
    type: "text",
    card_id: `promotext-${promo.id}`,
    isPromotion: true,
    position_priority: promo.position_priority,
    text: promo.text,
    href: promo.href,
    href_text: promo.href_text,
  };
};

export const mapPromoRawToImageCard = (
  promo: PromoRawQuery
): ContentCard | null => {
  if (!promo.image || !promo.height || !promo.width) return null;
  return {
    type: "image",
    card_id: `promoimage-${promo.id}`,
    isPromotion: true,
    position_priority: promo.position_priority,
    image: { src: promo.image, height: promo.height, width: promo.width },
    href: promo.href,
  };
};

export const getPromoInsertPosition = (
  length: number,
  priority: number | null
) => {
  if (length === 0) return 0;
  if (priority === null) return length;
  const position = length - Math.ceil((length * priority) / 100);
  return position;
};
