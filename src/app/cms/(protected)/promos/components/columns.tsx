"use client";

import { dateFormatter } from "@/lib/helpers/date-formatter";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { renderRowSelect } from "@/components/ui/composed/table/table-helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Image, MoreHorizontal } from "lucide-react";
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
import { toast } from "sonner";
import SortableColumnHeader from "@/components/ui/composed/table/sortable-column-header";
import Link from "next/link";
import { PromoTableData } from "@/lib/promos/queries";
import { promoStateOptions } from "@/lib/promos/data";
import { deletePromos, updatePromoStatus } from "@/lib/promos/actions";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<PromoTableData["data"][number]>();

export const columns = [
  renderRowSelect(columnHelper),
  columnHelper.accessor("title", {
    size: 150,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Title" />
    ),
  }),
  columnHelper.accessor("draft", {
    size: 60,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) =>
      getValue() ? <Badge>{"Draft"}</Badge> : <Badge>{"Active"}</Badge>,
  }),
  columnHelper.accessor("type", {
    size: 60,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Type" />
    ),
    cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
  }),
  columnHelper.accessor("pub_date", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Created On" />
    ),
    size: 100,
    cell: ({ getValue }) =>
      getValue().getTime() === 0 ? "N/A" : dateFormatter.format(getValue()),
  }),
  columnHelper.display({
    id: "actions",
    size: 50,
    cell: function Cell({ row, table }) {
      const selectedIds = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original.id);
      if (selectedIds.length === 0) selectedIds.push(row.original.id);

      const handleUpdateStatus = (draft: boolean) => async () => {
        const res = await updatePromoStatus({
          ids: selectedIds,
          draft,
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {selectedIds.length <= 1 && (
              <Link href={`/cms/promos/${row.original.id}`} scroll={false}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {promoStateOptions.map((state) => (
                    <DropdownMenuItem
                      onClick={handleUpdateStatus(state.value)}
                      key={state.label}
                    >
                      {state.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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
                    const res = await deletePromos({
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
] as ColumnDef<PromoTableData["data"][number]>[];
