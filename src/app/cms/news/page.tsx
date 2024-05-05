import React from "react";
import { RssDataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { getRssList } from "@/lib/rss/queries";
import { SearchParamProps } from "@/lib/types";
import { RssParamsSchema } from "@/lib/rss/schema";
import { getNewsList } from "@/lib/news/queries";
import { NewsParamsSchema } from "@/lib/news/schema";

const RssPage = async ({ searchParams }: SearchParamProps) => {
  const parsedParams = NewsParamsSchema.parse(searchParams);
  const data = await getNewsList(parsedParams);
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">News</h2>
          <p className="text-muted-foreground">Manage news content</p>
        </div>
      </div>
      <RssDataTable columns={columns} tableData={data} />
    </div>
  );
};

export default RssPage;
