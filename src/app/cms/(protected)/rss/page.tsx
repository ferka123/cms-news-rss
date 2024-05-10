import React from "react";
import { RssDataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getRssList } from "@/lib/rss/queries";
import { SearchParamProps } from "@/lib/types";
import { RssParamsSchema } from "@/lib/rss/schema";

const RssPage = async ({ searchParams }: SearchParamProps) => {
  const parsedParams = RssParamsSchema.parse(searchParams);
  const data = await getRssList(parsedParams);
  return (
    <div className="h-full bg-muted/40 p-4">
      <RssDataTable columns={columns} tableData={data} />
    </div>
  );
};

export default RssPage;
