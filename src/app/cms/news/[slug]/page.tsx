import React from "react";
import SourceForm from "../components/news-form";
import { sourceLoader } from "./source-loader";

export type SourceEditPageProps = {
  params: { slug: string };
};

const SourceEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return <SourceForm defaultValues={data} />;
};

export default SourceEditPage;
