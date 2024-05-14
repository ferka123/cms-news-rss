import "@tanstack/react-table";
import { type ClassValue } from "clsx";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    className?: ClassValue;
  }
}
