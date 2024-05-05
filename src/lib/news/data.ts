import { PubState } from "@prisma/client";

export const pubStateOptions = [
  { label: "Active", value: PubState.active },
  { label: "Deleted", value: PubState.deleted },
  { label: "Draft", value: PubState.draft },
  { label: "Hidden", value: PubState.hidden },
] as const;
