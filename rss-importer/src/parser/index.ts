import Parser from "rss-parser";
import { prisma } from "../db";
import { CustomFieldSchema, RssItemSchema, rssItemKeys } from "./schemas";
import {
  defaultFieldSettings,
  getAttributeDefaults,
  getCustomFieldDefaults,
} from "./defaults";
import { DefaultAttributes } from "./types";
import { getLastPubDate, transformToIsoDate, transformValue } from "./utils";

const getFieldMappings = (userFields: unknown) => {
  const customFields = getCustomFieldDefaults();
  const attributes = getAttributeDefaults();

  const fields = CustomFieldSchema.safeParse(userFields);
  if (fields.success) {
    if (fields.data) {
      Object.entries(fields.data).forEach(([field, [rssField, attr]]) => {
        customFields.push([
          rssField,
          field,
          {
            keepArray: defaultFieldSettings[field].keepArray ?? false,
            includeSnippet: defaultFieldSettings[field].includeSnippet ?? false,
          },
        ]);
        if (attr) attributes[field] = attr;
      });
    }
    return { customFields, attributes };
  } else {
    throw new Error(
      "Custom field validation failed. Errors: " +
        JSON.stringify(fields.error.flatten().fieldErrors, null, 2)
    );
  }
};

const transformRssItem = (
  data: Record<string, unknown>,
  attributes: DefaultAttributes,
  itemDescription = "item"
) => {
  const rssItemObject = Object.fromEntries(
    rssItemKeys.map((key) => [
      key,
      transformValue(
        data[key],
        defaultFieldSettings[key]?.keepArray,
        attributes[key]
      ),
    ])
  );

  const parseResult = RssItemSchema.safeParse(rssItemObject);
  if (parseResult.success) {
    return parseResult.data;
  } else {
    console.error(
      `Failed to parse ${itemDescription}. Errors:${JSON.stringify(
        parseResult.error.flatten().fieldErrors,
        null,
        2
      )}`
    );
    return null;
  }
};

export const getNewDataFromRss = async (id: number) => {
  const rss = await prisma.rss.findUnique({
    where: { id },
    include: { custom_tags: true },
  });
  if (!rss) throw new Error("No rss task found");

  const { customFields, attributes } = getFieldMappings(rss.custom_fields);

  const parser = new Parser({
    customFields: {
      item: customFields,
    },
  });

  const parsedRss = await parser.parseURL(rss.src);

  const lastPubDate = getLastPubDate(parsedRss.items);

  const parsedItems = parsedRss.items
    .filter(
      (item) =>
        (item.isoDate ?? transformToIsoDate(item.pubDate) ?? "") >
        rss.last_pub.toISOString()
    )
    .map((item) =>
      transformRssItem(
        item,
        attributes,
        `${rss.name}: ${item.title ?? ""}`.trim()
      )
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return { parsedItems, lastPubDate, task: rss };
};
