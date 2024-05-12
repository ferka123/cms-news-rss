"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTag, updateTag } from "@/lib/tags/actions";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  tag: {
    label: string;
    value?: number;
  } | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (tag: NonNullable<Required<Props["tag"]>>) => void;
};

export const TagModal = ({ tag, open, onClose, onSubmit }: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<{ tag: Props["tag"] }>({
    defaultValues: { tag },
  });

  const submitHandler = (data: { tag: Props["tag"] }) => {
    if (!data.tag) return;
    setLoading(true);
    const promise = data.tag.value
      ? updateTag({ label: data.tag.label, value: data.tag.value })
      : createTag(data.tag);

    toast.promise(promise, {
      loading: "Saving tag...",
      success: (res) => {
        if (res.serverError) throw new Error(res.serverError);

        if (res.validationErrors)
          throw new Error(
            res.validationErrors.label?.join(", ") || "Validation error"
          );

        if (res.data) {
          onSubmit(res.data);
          onClose();
        } else throw new Error("Failed to save tag");

        return "Tag has been saved";
      },
      error: (err) => err.message || "Failed to save tag",
      finally: () => setLoading(false),
    });
  };

  useEffect(() => {
    if (tag) reset({ tag });
  }, [tag, reset]);

  if (!tag) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tag.value ? "Edit" : "Create"} Tag</DialogTitle>
        </DialogHeader>
        <form id="tag-form" onSubmit={handleSubmit(submitHandler)}>
          <Input
            placeholder="Enter tag name"
            {...register("tag.label", {
              required: "Tag name is required",
              maxLength: { value: 30, message: "Tag name is too long" },
            })}
          />
          {errors.tag?.label && (
            <p className="text-sm font-medium text-destructive">
              {errors.tag?.label?.message}
            </p>
          )}
        </form>
        <DialogFooter>
          <Button variant={"secondary"} type="button" onClick={onClose}>
            Close
          </Button>
          <Button form="tag-form" type="submit" disabled={loading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
