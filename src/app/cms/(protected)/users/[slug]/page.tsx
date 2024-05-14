import React from "react";
import UserForm from "../components/user-form";
import { sourceLoader } from "./source-loader";
import SinglePageLayout from "@/app/cms/components/single-page-layout";

export type SourceEditPageProps = {
  params: { slug: string };
};

const SourceEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return (
    <SinglePageLayout title={data.name || "New user"} backHref="/cms/users">
      <UserForm defaultValues={data} />
    </SinglePageLayout>
  );
};

export default SourceEditPage;
