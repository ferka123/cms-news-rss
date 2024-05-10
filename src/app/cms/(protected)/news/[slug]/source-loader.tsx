import { getNewsById } from "@/lib/news/queries";
import { NewsForm } from "@/lib/news/schema";
import { getRssById } from "@/lib/rss/queries";
import { RssForm } from "@/lib/rss/schema";
import { notFound } from "next/navigation";

const defaultData: NewsForm = {
  tags: [],
  title: "",
  description: "",
  pub_state: "draft",
};

export const sourceLoader = async (slug: string) => {
  const maybeId = parseInt(slug);
  const data: NewsForm | null =
    slug === "create"
      ? defaultData
      : maybeId
      ? await getNewsById(maybeId)
      : null;

  if (!data) return notFound();

  return data;
};
