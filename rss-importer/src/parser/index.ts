import Parser from "rss-parser";
import { prisma } from "../db";
import {
  CustomFieldSchema,
  RssItem,
  RssItemSchema,
  rssItemKeys,
} from "./schemas";
import {
  defaultFieldSettings,
  getAttributeDefaults,
  getCustomFieldDefaults,
} from "./defaults";
import { DefaultAttributes, ParseError } from "./types";
import { getLastPubDate, transformToIsoDate, transformValue } from "./utils";

const getFieldMappings = (userFields: unknown) => {
  const customFields = getCustomFieldDefaults();
  const attributes = getAttributeDefaults();

  const fields = CustomFieldSchema.safeParse(userFields);
  if (fields.success) {
    if (fields.data) {
      fields.data.forEach(({ mapKey, rssKey, attr }) => {
        customFields.push([
          rssKey,
          mapKey,
          {
            keepArray: defaultFieldSettings[mapKey].keepArray ?? false,
            includeSnippet:
              defaultFieldSettings[mapKey].includeSnippet ?? false,
          },
        ]);
        if (attr) attributes[mapKey] = attr;
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
  data: Record<string, Parser.Item>,
  attributes: DefaultAttributes,
  itemDescription = "item"
): RssItem | ParseError => {
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
    return {
      error: `Failed to parse ${data["guid"] || itemDescription}`,
    };
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

  const newItems = parsedRss.items
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
    );

  const errors = newItems.filter((item): item is ParseError => "error" in item);

  const parsedItems = newItems.filter(
    (item): item is RssItem => "error" in item === false
  );

  return { parsedItems, lastPubDate, task: rss, errors };
};
