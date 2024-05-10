import { z } from "zod";
import { SearchParamsSchema } from "../common/search-params";
import { Prisma, UserRole, UserState } from "@prisma/client";
import {
  MediaSchema,
  MultipleIdSchema,
  MultipleStringIdSchema,
} from "../common/schemas";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  role: z.nativeEnum(UserRole),
  state: z.nativeEnum(UserState),
  media: MediaSchema.pick({ src: true, id: true }).nullable().optional(),
});

export const UserUpdateSchema = UserSchema.partial()
  .merge(z.object({ id: z.string().min(1), password: z.string().optional() }))
  .refine(
    ({ password }) =>
      !password || (password.length >= 8 && password.length <= 32),
    {
      message: "Password must be 8-32 characters long",
      path: ["password"],
    }
  );

export type UserForm = z.infer<typeof UserSchema> & { id?: string };

export const UserStateSchema = MultipleStringIdSchema.merge(
  UserSchema.pick({ state: true })
);

export const UserRoleSchema = MultipleStringIdSchema.merge(
  UserSchema.pick({ role: true })
);

export const UserListParamsSchema = SearchParamsSchema.merge(
  z.object({
    order: z.enum(["asc", "desc"]).optional().default("desc").catch("desc"),
    sort: z
      .enum([
        Prisma.UserScalarFieldEnum.name,
        Prisma.UserScalarFieldEnum.role,
        Prisma.UserScalarFieldEnum.state,
        Prisma.UserScalarFieldEnum.pub_date,
      ])
      .optional()
      .default(Prisma.UserScalarFieldEnum.pub_date)
      .catch(Prisma.UserScalarFieldEnum.pub_date),
    status: z
      .enum([UserState.active, UserState.suspended, ""])
      .optional()
      .catch(""),
  })
);

export type UserListParams = z.infer<typeof UserListParamsSchema>;
