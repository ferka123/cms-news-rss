import type { UserRole, UserState } from "@prisma/client";

export const userStateOptions: { label: string; value: UserState }[] = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
] as const;

export const userRoleOptions: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "admin" },
  { label: "Author", value: "author" },
] as const;
