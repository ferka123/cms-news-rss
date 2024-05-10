import React from "react";
import NewsPublicationForm from "../components/news-form";
import { sourceLoader } from "./source-loader";
import SinglePageLayout from "@/app/cms/components/single-page-layout";

export type SourceEditPageProps = {
  params: { slug: string };
};

const SourceEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return (
    <SinglePageLayout
      title={data.title || "New Publication"}
      backHref="/cms/news"
    >
      <NewsPublicationForm defaultValues={data} />
    </SinglePageLayout>
  );
};

export default SourceEditPage;
