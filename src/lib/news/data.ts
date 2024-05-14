import type { PubState } from "@prisma/client";

export const pubStateOptions: { label: string; value: PubState }[] = [
  { label: "Active", value: "active" },
  { label: "Deleted", value: "deleted" },
  { label: "Draft", value: "draft" },
  { label: "Hidden", value: "hidden" },
] as const;
