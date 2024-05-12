import { PageSearchParams } from "@/app/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatUrlParams = (
  searchParams?: PageSearchParams["searchParams"]
) =>
  new URLSearchParams(
    Object.entries(searchParams ?? {})
      .map(([key, value]) =>
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
      )
      .flat()
  );
