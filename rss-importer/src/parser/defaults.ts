import {
  DefaultAttributes,
  DefaultFieldSettings,
  ParserCustomField,
} from "./types";

export const defaultFieldSettings: DefaultFieldSettings = {
  categories: { keepArray: true },
  description: { includeSnippet: true },
  content: { includeSnippet: true },
} as const;

export const getCustomFieldDefaults = (): ParserCustomField[] => [
  ["media:content", "media"],
  ["media:thumbnail", "media"],
];

export const getAttributeDefaults = (): DefaultAttributes => ({
  media: "url",
});
