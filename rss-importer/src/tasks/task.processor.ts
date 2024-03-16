import { prisma } from "../db";
import { getNewDataFromRss } from "../parser";
import { processMedia } from "./media.processor";
import { Prisma } from "@prisma/client";
import { transformToIsoDate } from "../parser/utils";

export const processTask = async (id: number) => {
  try {
    const { parsedItems, lastPubDate, task } = await getNewDataFromRss(id);
    if (parsedItems.length === 0) return;

    const itemsWithMedia = await Promise.all(parsedItems.map(processMedia));

    await prisma.rss.update({
      where: { id },
      data: {
        last_pub: lastPubDate,
        news: {
          create: itemsWithMedia.map(
            (item): Prisma.NewsCreateWithoutImported_fromInput => {
              const tags = task.should_import_tags ? item.categories : [];
              return {
                pub_state: "ACTIVE",
                title: item.title,
                external_author: item.creator,
                external_link: item.link,
                description: item.contentSnippet ?? item.content,
                pub_date:
                  item.isoDate ??
                  transformToIsoDate(item.pubDate) ??
                  new Date(),
                media: item.media ? { create: item.media } : undefined,
                tags: {
                  connect: task.custom_tags.map(({ id }) => ({ id })),
                  connectOrCreate: tags.map((name) => ({
                    create: { name },
                    where: { name },
                  })),
                },
              };
            }
          ),
        },
      },
    });

    console.log(
      `Successfully added ${parsedItems.length} items to ${task.name} id=${task.id}`
    );
  } catch (e) {
    console.error("Failed to process task id=", id, e);
  }
};
