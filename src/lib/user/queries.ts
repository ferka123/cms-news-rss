import { Prisma } from "@prisma/client";
import { db } from "../db";
import { UserForm, UserListParams } from "./schema";
import { notFound } from "next/navigation";

export const getUserByEmail = async (email: string) => {
  return db.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      state: true,
      media: true,
      password: true,
    },
  });
};

export const getUserList = async (state: UserListParams) => {
  const where: Prisma.UserWhereInput = {};
  if (state.q) where.name = { contains: state.q, mode: "insensitive" };
  if (state.status) where.state = state.status;

  const [data, count] = await db.$transaction([
    db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        state: true,
        media: true,
        pub_date: true,
      },
      where,
      take: state.limit,
      skip: (state.page - 1) * state.limit,
      orderBy: { [state.sort]: state.order },
    }),
    db.user.count({ where }),
  ]);

  return {
    data,
    state: { ...state, totalRows: count },
  };
};

export type UserListTableData = Awaited<ReturnType<typeof getUserList>>;

export const getUserFormById = async (id: string): Promise<UserForm> => {
  const res = await db.user.findUnique({
    include: { media: true },
    where: { id },
  });
  if (!res) return notFound();

  const { password, media_id, ...rest } = res;

  return {
    ...rest,
    name: res.name ?? "",
    email: res.email ?? "",
    password: "",
  };
};
