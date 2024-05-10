import { getRssById } from "@/lib/rss/queries";
import { RssForm } from "@/lib/rss/schema";
import { notFound } from "next/navigation";

const defaultData: RssForm = {
  custom_fields: [],
  custom_tags: [],
  name: "",
  src: "",
  interval: 10,
  paused: false,
  should_import_tags: true,
};

export const sourceLoader = async (slug: string) => {
  const maybeId = parseInt(slug);
  const data: RssForm | null =
    slug === "create"
      ? defaultData
      : maybeId
      ? await getRssById(maybeId)
      : null;

  if (!data) return notFound();

  return data;
};
