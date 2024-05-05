import React from "react";
import { promoLoader } from "./promo-loader";
import PromoForm from "../components/promos-form";

export type SourceEditPageProps = {
  params: { slug: string };
};

const PromoEditPage = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await promoLoader(slug);
  return <PromoForm defaultValues={data} />;
};

export default PromoEditPage;
