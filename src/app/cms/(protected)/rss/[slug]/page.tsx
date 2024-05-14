import React from "react";
import SourceForm from "../components/rss-form";
import { sourceLoader } from "./source-loader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import SinglePageLayout from "@/app/cms/components/single-page-layout";

export type SourceEditPageProps = {
  params: { slug: string };
};

const SourceEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return (
    <SinglePageLayout title={data.name || "New Source"} backHref="/cms/rss">
      <SourceForm defaultValues={data} />
    </SinglePageLayout>
  );
};

export default SourceEditPage;
