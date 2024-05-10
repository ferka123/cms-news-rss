"use server";

import { ActionError, adminAction } from "../action-client";
import { MultipleStringIdSchema } from "../common/schemas";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import {
  UserRoleSchema,
  UserSchema,
  UserStateSchema,
  UserUpdateSchema,
} from "./schema";
import { saltAndHashPassword } from "./utils";

export const deleteUsers = adminAction(
  MultipleStringIdSchema,
  async ({ ids }, { session }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    if (ids.includes(session.user.id!))
      throw new ActionError("You cannot perform this action on yourself");

    const rss = await db.user.findMany({ where: { id: { in: ids } } });
    if (rss.length !== ids.length)
      throw new ActionError("Some of the selected items cannot be found");

    try {
      await db.user.deleteMany({ where: { id: { in: ids } } });

      revalidatePath("/cms/users");
    } catch {
      throw new ActionError("Failed to delete selected users");
    }

    return { message: "Selected users have been deleted" };
  }
);

export const updateUserState = adminAction(
  UserStateSchema,
  async ({ ids, state }, { session }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    if (ids.includes(session.user.id!))
      throw new ActionError("You cannot perform this action on yourself");

    console.log(ids, session);

    try {
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { state },
      });

      revalidatePath("/cms/users");
    } catch {
      throw new ActionError(`Failed to change user state to ${state}`);
    }

    return {
      message: `Changed user state to ${state}`,
    };
  }
);

export const updateUserRole = adminAction(
  UserRoleSchema,
  async ({ ids, role }, { session }) => {
    if (ids.length === 0) throw new ActionError("No items selected");

    if (ids.includes(session.user.id!))
      throw new ActionError("You cannot perform this action on yourself");

    try {
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { role },
      });

      revalidatePath("/cms/users");
    } catch {
      throw new ActionError(`Failed to change user role to ${role}`);
    }

    return {
      message: `Changed user role to ${role}`,
    };
  }
);

export const createUser = adminAction(
  UserSchema,
  async ({ media, password, ...rest }): Promise<{ success: string }> => {
    try {
      const hashedPassword = await saltAndHashPassword(password);
      await db.user.create({
        data: {
          ...rest,
          password: hashedPassword,
          media: media?.id ? { connect: { id: media.id } } : undefined,
        },
      });

      revalidatePath("/cms/users");

      return { success: "User has been created" };
    } catch {
      throw new ActionError("Failed to create user");
    }
  }
);

export const updateUser = adminAction(
  UserUpdateSchema,
  async ({ media, password, id, ...rest }): Promise<{ success: string }> => {
    try {
      const hashedPassword = password
        ? await saltAndHashPassword(password)
        : undefined;

      await db.user.update({
        data: {
          ...rest,
          password: hashedPassword,
          media: media?.id
            ? { connect: { id: media.id } }
            : media === null
            ? { disconnect: true }
            : undefined,
        },
        where: { id },
      });

      revalidatePath("/cms/users");

      return { success: "User has been updated" };
    } catch {
      throw new ActionError("Failed to update user");
    }
  }
);
