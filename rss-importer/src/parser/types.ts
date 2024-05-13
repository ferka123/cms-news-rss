export type ParserCustomField =
  | [string, string]
  | [string, string, { keepArray: boolean; includeSnippet?: boolean }];

export type DefaultFieldSettings = {
  [key: string]: { keepArray?: boolean; includeSnippet?: boolean };
};

export type DefaultAttributes = { [key: string]: string };

export type ParseError = { error: string };
