import { Prisma } from "@prisma/client";
import { CustomFieldsSchema, RssForm } from "./schema";
import { Option } from "../common/option";

export const rssFormMapper = ({
  name,
  src,
  paused,
  should_import_tags,
  interval,
  custom_fields,
  custom_tags,
}: Prisma.RssGetPayload<{ include: { custom_tags: true } }>): RssForm => {
  const parsedCustomFields = CustomFieldsSchema.safeParse(custom_fields);
  return {
    name,
    src,
    paused,
    should_import_tags,
    interval,
    custom_fields: parsedCustomFields.success ? parsedCustomFields.data : [],
    custom_tags: custom_tags.map((tag) => ({
      label: tag.name,
      value: tag.id.toString(),
    })),
  };
};

export const rssListMapper = (list: { id: number; name: string }): Option => {
  return {
    label: list.name,
    value: list.id.toString(),
  };
};
