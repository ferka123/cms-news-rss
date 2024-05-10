import React from "react";
import { NewsDataTable } from "./components/data-table";
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
    <div className="h-full bg-muted/40 p-4">
      <NewsDataTable columns={columns} tableData={data} />
    </div>
  );
};

export default RssPage;
