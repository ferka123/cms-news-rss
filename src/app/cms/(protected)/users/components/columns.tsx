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
import { CircleUser, Image, MoreHorizontal } from "lucide-react";
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
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import type { UserRole, UserState } from "@prisma/client";

import { UserListTableData } from "@/lib/user/queries";
import {
  deleteUsers,
  updateUserRole,
  updateUserState,
} from "@/lib/user/actions";
import { userRoleOptions, userStateOptions } from "./options-data";

const columnHelper = createColumnHelper<UserListTableData["data"][number]>();

export const columns = [
  renderRowSelect(columnHelper),
  columnHelper.accessor("name", {
    size: 150,
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Title" />
    ),
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">
          {row.original.media?.src ? (
            <NextImage
              className="object-cover rounded-full w-[30px] h-[30px] flex-shrink-0"
              src={row.original.media.src}
              alt={row.original.name}
              width={30}
              height={30}
            />
          ) : (
            <CircleUser className="flex-shrink-0" strokeWidth={1} size={30} />
          )}
        </span>
        <span>{getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("state", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Status" />
    ),
    size: 50,
    cell: ({ getValue }) => (
      <Badge
        variant={getValue() === "active" ? "default" : "secondary"}
        className="font-normal capitalize"
      >
        {getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("role", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Role" />
    ),
    size: 50,
    cell: ({ getValue }) => (
      <Badge variant={"outline"} className="font-normal capitalize">
        {getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("pub_date", {
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Creation Date" />
    ),
    meta: { className: "hidden md:table-cell" },
    cell: ({ getValue }) =>
      getValue().getTime() === 0 ? "N/A" : dateFormatter.format(getValue()),
  }),
  columnHelper.display({
    id: "actions",
    cell: function Cell({ row, table }) {
      const [showDeleteAlert, setShowDeleteAlert] = useState(false);
      const [stateAlert, setStateAlert] = useState<UserState | null>(null);
      const [roleAlert, setRoleAlert] = useState<UserRole | null>(null);

      const selectedIds = table
        .getFilteredSelectedRowModel()
        .rows.map((r) => r.original.id);
      if (selectedIds.length === 0) selectedIds.push(row.original.id);

      const handleUpdateStatus = (state: UserState) => async () => {
        const res = await updateUserState({
          ids: selectedIds,
          state,
        });
        if (res.serverError || res.validationErrors?.ids)
          toast.error(res.serverError || res.validationErrors?.ids);
        if (res.data) {
          table.toggleAllRowsSelected(false);
          toast.success(res.data.message);
        }
        setStateAlert(null);
      };

      const handleUpdateRole = (role: UserRole) => async () => {
        const res = await updateUserRole({
          ids: selectedIds,
          role,
        });
        if (res.serverError || res.validationErrors?.ids)
          toast.error(res.serverError || res.validationErrors?.ids);
        if (res.data) {
          table.toggleAllRowsSelected(false);
          toast.success(res.data.message);
        }
        setRoleAlert(null);
      };

      const handleDeleteUsers = async () => {
        const res = await deleteUsers({
          ids: selectedIds,
        });
        if (res.serverError || res.validationErrors?.ids)
          toast.error(res.serverError || res.validationErrors?.ids);
        if (res.data) {
          toast.success(res.data.message);
          table.toggleAllRowsSelected(false);
        }
        setShowDeleteAlert(false);
      };

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
              <Link href={`/cms/users/${row.original.id}`} scroll={false}>
                <DropdownMenuItem>Edit</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {userStateOptions.map((state) => (
                    <DropdownMenuItem
                      onSelect={() => setStateAlert(state.value)}
                      key={state.value}
                    >
                      {state.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {userRoleOptions.map((state) => (
                    <DropdownMenuItem
                      onSelect={() => setRoleAlert(state.value)}
                      key={state.value}
                    >
                      {state.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              onSelect={() => setShowDeleteAlert(true)}
              className="text-red-600"
            >
              {selectedIds.length <= 1
                ? "Delete"
                : `Delete ${selectedIds.length} users`}
            </DropdownMenuItem>
          </DropdownMenuContent>
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertContent
              action={handleDeleteUsers}
              actionTitle="Delete"
              description="This action cannot be undone. This will permanently delete
              selected users"
            />
          </AlertDialog>
          <AlertDialog
            open={Boolean(stateAlert)}
            onOpenChange={(open) => !open && setStateAlert(null)}
          >
            <AlertContent
              action={handleUpdateStatus(stateAlert!)}
              actionTitle={stateAlert === "active" ? "Reinstate" : "Suspend"}
              description={`This action will change the user's state to ${stateAlert}`}
            />
          </AlertDialog>
          <AlertDialog
            open={Boolean(roleAlert)}
            onOpenChange={(open) => !open && setRoleAlert(null)}
          >
            <AlertContent
              action={handleUpdateRole(roleAlert!)}
              actionTitle={`Change to ${roleAlert}`}
              description={`This action will change the user's role to ${roleAlert}`}
            />
          </AlertDialog>
        </DropdownMenu>
      );
    },
  }),
] as ColumnDef<UserListTableData["data"][number]>[];

const AlertContent = ({
  action,
  actionTitle,
  description,
}: {
  actionTitle: string;
  description: string;
  action: () => void;
}) => (
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <Button className="capitalize" variant="destructive" onClick={action}>
        {actionTitle}
      </Button>
    </AlertDialogFooter>
  </AlertDialogContent>
);
