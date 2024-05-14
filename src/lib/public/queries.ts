import { Prisma } from "@prisma/client";
import { db } from "../db";
import { getPromoSettings } from "../promos/settings";
import {
  ContentCard,
  PromoRawQuery,
  PublicNewsList,
  PublicNewsParams,
} from "./types";
import { NewsIncludeInput } from "./prisma-inputs";
import {
  getPromoInsertPosition,
  mapPrismaPayloadToNewsCard,
  mapPromoRawToImageCard,
  mapPromoRawToTextCard,
} from "./utils";
import { cache } from "react";
const NEWS_LIST_LIMIT = 20;

const getPromotions = async (
  params: PublicNewsParams
): Promise<ContentCard[]> => {
  const promoSettings = await getPromoSettings();

  const promoTakeCount =
    (params.type !== "search"
      ? promoSettings.list_count
      : promoSettings.search_count) ?? 0;

  const baseWhereClause = Prisma.sql`page_placement::text IN (${Prisma.join([
    "both",
    params.type !== "search" ? "list" : "search",
  ])}) AND draft = FALSE`;

  const whereClause =
    params.type === "search"
      ? Prisma.sql`${baseWhereClause} AND ${params.q} ~ COALESCE(search_regexp, '')`
      : Prisma.sql`${baseWhereClause} AND list_filter = ${
          params.type === "filter"
        }`;

  const count = await db.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(*) as count
    FROM "Promo"
    WHERE ${whereClause};
  `;
  const promoCount = Number(count[0].count);

  const promos = await db.$queryRaw<PromoRawQuery[]>`
      SELECT "Promo".*, "Media".src as image, "Media".height, "Media".width
      FROM "Promo"
      LEFT JOIN "Media" ON "Promo".media_id = "Media".id
      WHERE ${whereClause}
      ORDER BY "Promo".pagination_priority DESC
      LIMIT ${promoTakeCount}
      OFFSET ${((params.page ?? 0) * promoTakeCount) % promoCount};
    `;

  const newsIds = Object.fromEntries(
    promos
      .filter((promo) => promo.type === "news" && promo.news_id)
      .map((promo) => [promo.news_id!, promo.position_priority])
  );

  const promotionalNews =
    Object.keys(newsIds).length > 0
      ? await db.news
          .findMany({
            include: NewsIncludeInput,
            where: { id: { in: Object.keys(newsIds).map(Number) } },
          })
          .then((news) =>
            news.map((news) =>
              mapPrismaPayloadToNewsCard(
                news,
                true,
                `promonews-${news.id}`,
                newsIds[news.id]
              )
            )
          )
      : [];

  const promotionalTexts = promos
    .filter((promo) => promo.type === "text")
    .map(mapPromoRawToTextCard)
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const promotionalImages = promos
    .filter((promo) => promo.type === "image")
    .map(mapPromoRawToImageCard)
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return [...promotionalNews, ...promotionalTexts, ...promotionalImages];
};

export const getPublicNewsList = async (
  params: PublicNewsParams
): Promise<PublicNewsList> => {
  const newsWhereInput: Prisma.NewsWhereInput = { pub_state: "active" };
  if (params.q)
    newsWhereInput.title = { contains: params.q, mode: "insensitive" };
  if (params.tag) newsWhereInput.tags = { some: { id: params.tag } };

  const [promos, news, newsCount] = await Promise.all([
    getPromotions(params),
    db.news
      .findMany({
        include: NewsIncludeInput,
        where: newsWhereInput,
        take: NEWS_LIST_LIMIT,
        skip: (params.page - 1) * NEWS_LIST_LIMIT,
        orderBy: { id: "desc" },
      })
      .then((news) =>
        news.map((news) =>
          mapPrismaPayloadToNewsCard(news, false, `news-${news.id}`)
        )
      ),
    db.news.count({ where: newsWhereInput }),
  ]);

  //injecting promos into news list
  if (news.length !== 0)
    promos.forEach((promo) =>
      news.splice(
        getPromoInsertPosition(news.length, promo.position_priority ?? 0),
        0,
        promo
      )
    );

  return {
    data: news,
    state: {
      ...params,
      page: params.page ?? 0,
      totalRows: newsCount,
      totalPages: Math.ceil(newsCount / NEWS_LIST_LIMIT),
    },
  };
};

export const cachedGetPublicNewsList = cache(getPublicNewsList);
