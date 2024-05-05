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
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Promos</h2>
          <p className="text-muted-foreground">Manage promotional materials</p>
        </div>
      </div>
      <PromoDataTable columns={columns} tableData={data} settings={settings} />
    </div>
  );
};

export default PromoPage;
