import React from "react";
import { UserDataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { SearchParamProps } from "@/lib/types";
import { getUserList } from "@/lib/user/queries";
import { UserListParamsSchema } from "@/lib/user/schema";

const RssPage = async ({ searchParams }: SearchParamProps) => {
  const parsedParams = UserListParamsSchema.parse(searchParams);
  const data = await getUserList(parsedParams);
  return (
    <div className="h-full bg-muted/40 p-4">
      <UserDataTable columns={columns} tableData={data} />
    </div>
  );
};

export default RssPage;
