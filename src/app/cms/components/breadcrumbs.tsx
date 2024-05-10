"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const breadcrumbNameMap: Record<string, string> = {
  cms: "Dashboard",
  news: "News",
  create: "Create",
  users: "Users",
  rss: "RSS Imports",
  promos: "Promotions",
};

export const BreadCrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const label =
            breadcrumbNameMap[segment] ||
            (isNaN(Number(segment)) ? segment : "Edit");
          return (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                {index < pathSegments.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
