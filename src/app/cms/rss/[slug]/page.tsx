import React from "react";
import SourceForm from "../components/rss-form";
import { notFound } from "next/navigation";
import { getRssById } from "@/lib/rss/queries";
import type { RssForm } from "@/lib/rss/schema";
import { sourceLoader } from "./source-loader";

export type SourceEditPageProps = {
  params: { slug: string };
};

const SourceEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return <SourceForm defaultValues={data} />;
};

export default SourceEditPage;
