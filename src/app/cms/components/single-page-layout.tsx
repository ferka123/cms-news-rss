import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const SinglePageLayout: React.FC<
  React.PropsWithChildren<{ title: string; backHref: string }>
> = ({ title, backHref, children }) => {
  return (
    <div className="bg-muted/40 p-2 h-full">
      <div className="flex items-center gap-4">
        <Link href={backHref}>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
};

export default SinglePageLayout;
