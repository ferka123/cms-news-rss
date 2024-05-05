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
import { NewsTableData } from "@/lib/news/queries";
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { PubState } from "@prisma/client";
import { deleteNews, updateNewsStatus } from "@/lib/news/actions";
import { pubStateOptions } from "@/lib/news/data";
import { capitalize } from "@/lib/helpers/capitalize";

const columnHelper = createColumnHelper<NewsTableData["data"][number]>();

export const columns = [
  renderRowSelect(columnHelper),
  columnHelper.accessor("media", {
    size: 100,
    maxSize: 100,
    header: () => null,
    cell: ({ getValue, row }) => {
      const media = getValue();
      return media ? (
        <NextImage
          className="object-cover rounded-md"
          src={media.src}
          alt={row.original.title}
          width={100}
          height={100}
        />
      ) : (
        <Image strokeWidth={0.5} size={100} />
      );
    },
  }),
  columnHelper.accessor("title", {
    size: 150,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Title" />
    ),
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    size: 200,
    cell: ({ getValue }) => (
      <div className="flex gap-2 flex-wrap">
        {getValue()
          .slice(0, 4)
          .map((tag) => (
            <Badge variant={"secondary"} className="font-normal" key={tag.id}>
              {tag.name}
            </Badge>
          ))}
        {getValue().length > 4 && "..."}
      </div>
    ),
  }),
  columnHelper.accessor("pub_state", {
    size: 60,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Status" />
    ),
    cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
  }),
  columnHelper.accessor("pub_date", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Published Date" />
    ),
    size: 100,
    cell: ({ getValue }) =>
      getValue().getTime() === 0 ? "N/A" : dateFormatter.format(getValue()),
  }),
  columnHelper.display({
    id: "actions",
    size: 50,
    cell: ({ row, table }) => {
      const selectedIds = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original.id);
      if (selectedIds.length === 0) selectedIds.push(row.original.id);

      const handleUpdateStatus = (pub_state: PubState) => async () => {
        const res = await updateNewsStatus({
          ids: selectedIds,
          pub_state,
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
              <Link href={`/cms/news/${row.original.id}`} scroll={false}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {pubStateOptions.map((state) => (
                    <DropdownMenuItem
                      onClick={handleUpdateStatus(state.value)}
                      key={state.value}
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
                    const res = await deleteNews({
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
] as ColumnDef<NewsTableData["data"][number]>[];
