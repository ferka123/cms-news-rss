import React from "react";
import { promoLoader } from "./promo-loader";
import PromoForm from "../components/promos-form";
import SinglePageLayout from "@/app/cms/components/single-page-layout";

export type SourceEditPageProps = {
  params: { slug: string };
};

const PromoEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await promoLoader(slug);
  return (
    <SinglePageLayout title={data.title || "New Promotion"} backHref="/cms/promos">
      <PromoForm defaultValues={data} />
    </SinglePageLayout>
  );
};

export default PromoEditPage;
