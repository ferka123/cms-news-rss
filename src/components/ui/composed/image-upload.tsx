"use client";

import React, { useState } from "react";
import { useCallback } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { Input } from "../input";
import { Button } from "../button";
import { CircleX, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { NewsForm } from "@/lib/news/schema";
import { uploadMedia } from "@/lib/common/actions";
import { toast } from "sonner";

export default function ImageUpload<T extends FieldValues>(
  props: UseControllerProps<T>
) {
  const [loading, setLoading] = useState(false);
  const control = useController(props);
  const selectedImage = control.field.value as NewsForm["media"];

  const removeSelectedImage = () => {
    control.field.onChange(null);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (loading) return;
      const selectedImage = acceptedFiles[0];

      const formData = new FormData();
      formData.append("file", selectedImage);
      setLoading(true);
      toast.promise(uploadMedia(formData), {
        loading: "Uploading image...",
        error: (e) => {
          setLoading(false);
          return e?.message || "Failed to upload image";
        },
        success: (res) => {
          control.field.onChange(res);
          setLoading(false);
          return "Image uploaded successfully";
        },
      });
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragReject,
    isDragAccept,
    fileRejections,
  } = useDropzone({
    onDrop,
    disabled: loading,
    accept: { "image/*": [] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="flex shrink-0 justify-center items-center gap-4">
      <div className="relative">
        {selectedImage?.src ? (
          <div className="w-[150px] h-[150px] flex">
            <Image
              className="rounded-lg object-cover"
              width={150}
              height={150}
              alt="Image preview"
              src={selectedImage.src}
            />
            <Button
              onClick={removeSelectedImage}
              variant={"outline"}
              className="absolute -top-1 -right-1 p-0 h-auto rounded-full"
            >
              <CircleX />
            </Button>
          </div>
        ) : (
          <div className="w-[150px] h-[150px]">
            <ImageIcon width={150} height={150} strokeWidth="0.3" />
          </div>
        )}
      </div>
      <div {...getRootProps()} className=" flex items-center w-full">
        <label
          htmlFor="dropzone-file"
          className={cn(
            "relative flex flex-1 flex-col items-center justify-center w-full py-6 border rounded-lg cursor-pointer h-[150px]",
            isDragAccept
              ? "border-green-500"
              : isDragReject || fileRejections.length > 0
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          )}
        >
          {!loading && !selectedImage?.src && fileRejections.length === 0 && (
            <div className=" text-center">
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag an image</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Click to upload &#40; image should be under 2 MB &#41;
              </p>
            </div>
          )}

          {!loading && selectedImage?.src && fileRejections.length === 0 && (
            <div className="text-center">
              <p className=" text-sm font-semibold">Picture Uploaded</p>
              <p className=" text-xs text-gray-400">
                Picture will be uploaded when you save the form
              </p>
            </div>
          )}

          {!loading && fileRejections.length > 0 && (
            <div className=" text-center text-red-500">
              <p className="mt-2 text-sm">
                <span className="font-semibold">Image Rejected</span>
              </p>
              <p className="text-xs">Image should be under 2 MB</p>
            </div>
          )}

          {loading && (
            <div className="text-center">
              <p className=" text-sm font-semibold">Uploading picture</p>
              <p className=" text-xs text-gray-400">
                Please don't close this window
              </p>
            </div>
          )}
        </label>
        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
        />
      </div>
    </div>
  );
}
