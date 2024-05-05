"use client";

import { useRouter } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

const RouteModal = ({ children, title, description, className }: Props) => {
  const router = useRouter();
  return (
    <Dialog defaultOpen modal onOpenChange={() => router.back()}>
      <DialogContent
        className={className}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>description</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default RouteModal;
