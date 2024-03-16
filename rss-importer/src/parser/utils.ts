export const cleanString = (data: string) => {
  return data.replaceAll("\n", "").trim();
};

export const extractValue = (data: unknown, attr?: string) => {
  if (typeof data === "string") return cleanString(data);
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, any>;
    //$ = attribute field, _ = child text node
    const maybeString = attr ? obj["$"]?.[attr] : obj["_"];
    return typeof maybeString === "string" ? cleanString(maybeString) : null;
  }
  return null;
};

export const transformValue = (
  data: unknown,
  shouldBeArray = false,
  attr?: string
) => {
  const arrayData = Array.isArray(data) ? data : [data];
  return shouldBeArray
    ? arrayData.map((item) => extractValue(item, attr)).filter(Boolean)
    : extractValue(arrayData.at(0), attr);
};

export const transformToIsoDate = (maybeDate: unknown) => {
  if (typeof maybeDate !== "string") return null;
  const parsedDate = Date.parse(maybeDate);
  return parsedDate ? new Date(parsedDate).toISOString() : null;
};

export const getLastPubDate = (items: { isoDate?: string; pubDate?: string }[]) => {
  let maxDate = new Date(0).toISOString();
  items.forEach((item) => {
    const date = item.isoDate ?? transformToIsoDate(item.isoDate);
    if (!date) return new Date().toISOString();
    if (date > maxDate) maxDate = date;
  });
  return maxDate;
};
