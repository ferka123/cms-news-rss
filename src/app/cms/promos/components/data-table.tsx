"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTable from "@/components/ui/composed/table/table";
import { DataTablePagination } from "@/components/ui/composed/table/table-pagination";
import TableTopBar from "./table-topbar";
import { PromoTableData } from "@/lib/promos/queries";
import type { PromoSettings } from "@/lib/promos/schema";

interface DataTableProps {
  columns: ColumnDef<PromoTableData["data"][number]>[];
  tableData: PromoTableData;
  settings: PromoSettings;
}

export function PromoDataTable({
  columns,
  tableData: { data, state },
  settings,
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
      <TableTopBar state={state} settings={settings} />
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination className="p-4" table={table} />
    </div>
  );
}
