import React from "react";
import { PromoDataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { SearchParamProps } from "@/lib/types";
import { PromosParamsSchema } from "@/lib/promos/schema";
import { getPromosList } from "@/lib/promos/queries";
import { getPromoSettings } from "@/lib/promos/settings";

const PromoPage = async ({ searchParams }: SearchParamProps) => {
  const parsedParams = PromosParamsSchema.parse(searchParams);
  const [data, settings] = await Promise.all([
    getPromosList(parsedParams),
    getPromoSettings(),
  ]);
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 bg-muted/40 p-4">
      <PromoDataTable columns={columns} tableData={data} settings={settings} />
    </div>
  );
};

export default PromoPage;
