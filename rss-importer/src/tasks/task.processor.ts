import { prisma } from "../db";
import { getNewDataFromRss } from "../parser";
import { processMedia } from "./media.processor";
import { FailedImportType, Prisma } from "@prisma/client";
import { transformToIsoDate } from "../parser/utils";

export const processTask = async (id: number) => {
  try {
    const { parsedItems, lastPubDate, task, errors } = await getNewDataFromRss(
      id
    );
    if (parsedItems.length === 0 && errors.length === 0) return;

    if (errors.length > 0) {
      await prisma.failedImport.createMany({
        data: errors.map((data) => ({
          rss_id: id,
          error: data.error,
          type: FailedImportType.parsing,
        })),
      });
      console.error(
        `Some imports had parsing errors on ${task.name} id=${task.id}`
      );
      if (parsedItems.length === 0) {
        await prisma.rss.update({
          where: { id },
          data: {
            last_pub: lastPubDate,
          },
        });
        return;
      }
    }

    const itemsWithMedia = await Promise.all(parsedItems.map(processMedia));

    const mediaErrors = itemsWithMedia.filter((item) => item.mediaError);
    if (mediaErrors.length > 0) {
      await prisma.failedImport.createMany({
        data: mediaErrors.map((data) => ({
          rss_id: id,
          error: data.mediaError,
          type: FailedImportType.media_processing,
        })),
      });
      console.error(
        `Some imports had media processing errors on ${task.name} id=${task.id}`
      );
    }

    await prisma.rss.update({
      where: { id },
      data: {
        last_pub: lastPubDate,
        news: {
          create: itemsWithMedia.map(
            (item): Prisma.NewsCreateWithoutImported_fromInput => {
              const tags = task.should_import_tags ? item.categories : [];
              return {
                pub_state: "active",
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
