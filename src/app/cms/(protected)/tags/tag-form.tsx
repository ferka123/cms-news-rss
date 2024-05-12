"use client";

import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/composed/combobox";
import {  tagLoader } from "@/lib/common/option-loaders";
import React from "react";
import { useState } from "react";
import { TagModal } from "./tag-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteTag } from "@/lib/tags/actions";

export const TagForm = () => {
  const [tag, setTag] = useState<{ label: string; value: number } | null>(null);
  const [revalidateKey, setRevalidateKey] = useState(1);
  const [createTag, setCreateTag] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);

  const handleDelete = (id: number) => () => {
    toast.promise(deleteTag(id), {
      loading: "Deleting tag",
      success: (res) => {
        if (res.serverError) throw new Error(res.serverError);
        if (res.validationErrors) throw new Error("Wrong id format");
        setTag(null);
        setRevalidateKey((k) => k + 1);
        return "Tag has been deleted";
      },
      error: (err) => err.message || "Failed to delete tag",
    });
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-2">
        <Combobox
          key={revalidateKey}
          onCreate={(v) => {
            setCreateTag(v);
            setOpenModal(true);
          }}
          value={tag}
          onChange={setTag}
          loader={tagLoader}
        />
        {tag && (
          <div className="flex gap-2">
            <Button onClick={() => setOpenModal(true)} variant={"secondary"}>
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"}>Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this tag.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete(tag.value)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <TagModal
        tag={createTag ? { label: createTag } : tag}
        open={openModal}
        onClose={handleClose}
        onSubmit={(tag) => {
          setTag(tag);
          setCreateTag(null);
          setRevalidateKey((k) => k + 1);
        }}
      />
    </React.Fragment>
  );
};
