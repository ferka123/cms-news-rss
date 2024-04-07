export const rssMapKeyOptions = [
  { label: "Title", value: "title" },
  { label: "Author", value: "creator" },
  { label: "Content Snippet", value: "content" },
  { label: "Tags", value: "categories" },
  { label: "Media", value: "media" },
  { label: "Publication Date", value: "pubDate" },
] as const;

export const rssMapKeys = rssMapKeyOptions.map((opt) => opt.value);
