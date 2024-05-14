import React from "react";
import RouteModal from "@/components/ui/composed/route-modal";
import { promoLoader } from "../../[slug]/promo-loader";
import PromoForm from "../../components/promos-form";
import type { SourceEditPageProps } from "../../[slug]/page";

const page = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await promoLoader(slug);
  return (
    <RouteModal
      title={data.title ? "Update Promo" : "Create Promo"}
      className="max-w-screen-md w-full m-4"
    >
      <PromoForm defaultValues={data} isModal />
    </RouteModal>
  );
};

export default page;
