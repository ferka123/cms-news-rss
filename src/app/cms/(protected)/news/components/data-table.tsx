"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTable from "@/components/ui/composed/table/table";
import { DataTablePagination } from "@/components/ui/composed/table/table-pagination";
import TableTopBar from "./table-topbar";
import { NewsTableData } from "@/lib/news/queries";
import { User } from "next-auth";
import { getColumns } from "./columns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NewsParams } from "@/lib/news/schema";
import { applyParam } from "@/lib/common/search-params";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps {
  user: User;
  filterUser: boolean;
  tableData: NewsTableData;
}

export function NewsDataTable({
  user,
  filterUser,
  tableData: { data, state },
}: DataTableProps) {
  const columns = getColumns(user);

  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data: data,
    columns,
    manualPagination: true,
    rowCount: state.totalRows,
    manualSorting: true,
    enableMultiSort: false,
    state: {
      pagination: {
        pageIndex: state.page - 1,
        pageSize: state.limit,
      },
      sorting: [{ id: state.sort, desc: state.order === "desc" }],
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <TableTopBar state={state} />
      <div className="rounded-md border bg-background p-4">
        <div className="flex justify-between">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight">News</h2>
            <p className="text-muted-foreground">Manage news content</p>
          </div>
          <div className="flex items-center space-x-2 self-start mt-2">
            <Switch
              checked={filterUser}
              onCheckedChange={(checked) =>
                applyParam<NewsParams>(router, searchParams, {
                  author: checked ? "mine" : "",
                  page: 0,
                })
              }
              id="user-publications"
            />
            <Label htmlFor="user-publications">Show Mine</Label>
          </div>
        </div>
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination className="p-4" table={table} />
    </div>
  );
}
