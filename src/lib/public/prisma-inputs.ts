import { Prisma } from "@prisma/client";

export const NewsIncludeInput = {
  media: true,
  author: { select: { name: true } },
  tags: { select: { name: true, id: true } },
  imported_from: { select: { name: true } },
} satisfies Prisma.NewsInclude;

export type NewsPayload = Prisma.NewsGetPayload<{
  include: typeof NewsIncludeInput;
}>;
