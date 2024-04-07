import { Column } from "@tanstack/react-table";
import React from "react";
import { Button } from "../../button";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { applyParam } from "@/lib/common/search-params";
import { useRouter, useSearchParams } from "next/navigation";

interface Props<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

const SortableColumnHeader = <TData, TValue>({
  column,
  title,
}: Props<TData, TValue>) => {
  if (!column.getCanSort()) title;

  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Button
      variant={"ghost"}
      className="-ml-4"
      onClick={() =>
        applyParam<{ sort: string }>(router, searchParams, {
          order: column.getIsSorted() === "asc" ? "desc" : "asc",
          sort: column.id,
        })
      }
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowDownAZ size={16} className="ml-2 stroke-primary" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowUpZA size={16} className="ml-2 stroke-primary" />
      ) : null}
    </Button>
  );
};

export default SortableColumnHeader;
