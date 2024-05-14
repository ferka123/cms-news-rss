import React from "react";
import { NewsDataTable } from "./components/data-table";
import { SearchParamProps } from "@/lib/types";
import { getNewsList } from "@/lib/news/queries";
import { NewsParamsSchema } from "@/lib/news/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const RssPage = async ({ searchParams }: SearchParamProps) => {
  const parsedParams = NewsParamsSchema.parse(searchParams);
  const session = await auth();
  if (!session) redirect("/login");

  const data = await getNewsList(parsedParams, session.user.id);

  return (
    <div className="h-full bg-muted/40 p-4">
      <NewsDataTable user={session.user} tableData={data} filterUser={parsedParams.author === 'mine'} />
    </div>
  );
};

export default RssPage;
