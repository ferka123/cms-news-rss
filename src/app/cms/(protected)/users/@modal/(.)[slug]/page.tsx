import React from "react";
import RouteModal from "@/components/ui/composed/route-modal";
import { sourceLoader } from "../../[slug]/source-loader";
import SourceForm from "../../components/user-form";
import type { SourceEditPageProps } from "../../[slug]/page";

const page = async ({ params: { slug } }: SourceEditPageProps) => {
  const data = await sourceLoader(slug);
  return (
    <RouteModal
      title={data.id ? "Update User" : "Create User"}
      className="max-w-screen-md w-full m-4"
    >
      <SourceForm defaultValues={data} isModal />
    </RouteModal>
  );
};

export default page;
