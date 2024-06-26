"use client";

import { RssTableData } from "@/lib/rss/queries";
import { dateFormatter } from "@/lib/helpers/date-formatter";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { renderRowSelect } from "@/components/ui/composed/table/table-helpers";
import { formatDuration } from "@/lib/helpers/duration-formatter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteSources, updateSourceStatus } from "@/lib/rss/actions";
import { toast } from "sonner";
import SortableColumnHeader from "@/components/ui/composed/table/sortable-column-header";
import Link from "next/link";

const columnHelper = createColumnHelper<RssTableData["data"][number]>();

export const columns = [
  renderRowSelect(columnHelper),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Name" />
    ),
  }),
  columnHelper.accessor("paused", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => (getValue() ? "Paused" : "Active"),
  }),
  columnHelper.accessor("interval", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Interval" />
    ),
    cell: ({ getValue }) => formatDuration(getValue()),
  }),
  columnHelper.accessor("last_pub", {
    meta: { className: "hidden md:table-cell" },
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Last Date" />
    ),
    cell: ({ getValue }) =>
      getValue().getTime() === 0 ? "Never" : dateFormatter.format(getValue()),
  }),
  columnHelper.display({
    id: "actions",
    meta: { className: "max-h-[40px]" },
    cell: function Cell({ row, table }) {
      const selectedIds = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original.id);
      if (selectedIds.length === 0) selectedIds.push(row.original.id);

      const handleUpdateStatus = (paused: boolean) => async () => {
        const res = await updateSourceStatus({
          ids: selectedIds,
          paused,
        });
        if (res.serverError || res.validationErrors?.ids)
          toast.error(res.serverError || res.validationErrors?.ids);
        if (res.data) toast.success(res.data.message);
      };

      const [showAlert, setShowAlert] = useState(false);
      return (
        <DropdownMenu
          onOpenChange={(oppened) => {
            if (oppened && !selectedIds.includes(row.original.id))
              table.toggleAllPageRowsSelected(false);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {selectedIds.length <= 1 && (
              <Link href={`/cms/rss/${row.original.id}`} scroll={false}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
            )}
            {selectedIds.length <= 1 ? (
              <DropdownMenuItem
                onClick={handleUpdateStatus(!row.original.paused)}
              >
                {row.original.paused ? "Resume" : "Pause"}
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={handleUpdateStatus(false)}>
                  Activate selected items
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUpdateStatus(true)}>
                  Pause selected items
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onSelect={() => setShowAlert(true)}
              className="text-red-600"
            >
              {selectedIds.length <= 1
                ? "Delete"
                : `Delete ${selectedIds.length} items`}
            </DropdownMenuItem>
          </DropdownMenuContent>
          <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  selected import sources
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const res = await deleteSources({
                      ids: selectedIds,
                    });
                    if (res.serverError || res.validationErrors?.ids)
                      toast.error(res.serverError || res.validationErrors?.ids);
                    if (res.data) {
                      toast.success(res.data.message);
                      table.toggleAllRowsSelected(false);
                    }
                    setShowAlert(false);
                  }}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenu>
      );
    },
  }),
] as ColumnDef<RssTableData["data"][number]>[];
