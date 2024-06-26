"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { RssTableData } from "@/lib/rss/queries";
import DataTable from "@/components/ui/composed/table/table";
import { DataTablePagination } from "@/components/ui/composed/table/table-pagination";
import TableTopBar from "./table-topbar";

interface DataTableProps {
  columns: ColumnDef<RssTableData["data"][number]>[];
  tableData: RssTableData;
}

export function RssDataTable({
  columns,
  tableData: { data, state },
}: DataTableProps) {
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
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">RSS Imports</h2>
          <p className="text-muted-foreground">Manage RSS import sources</p>
        </div>
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination className="p-4" table={table} />
    </div>
  );
}
