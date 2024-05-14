import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./lib/user/queries";
import { verifyPassword } from "./lib/user/utils";
import { signInSchema } from "./lib/auth/schemas";
import type { UserRole } from "@prisma/client";
import { processEnv } from "./lib/env";

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/cms/login",
    signOut: "/cms",
    error: "/cms",
    verifyRequest: "/cms",
    newUser: "/cms",
  },
  callbacks: {
    jwt: async ({ user, token }) => {
      return user?.role ? { ...token, role: user.role } : token;
    },
    session: async ({ token, session }) => {
      if (token?.role && session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.sub as string;
      }

      return session;
    },
    redirect: async ({ url }) =>
      new URL(url, processEnv.METADATA_BASE_URL).toString(),
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = signInSchema.parse(credentials);
          const data = await getUserByEmail(email);
          if (!data) throw new Error("User not found");

          const { password: hashedPassword, media, state, ...user } = data;

          if (state !== "active") throw new Error("User is suspended");

          const isValidPassowrd = await verifyPassword(
            hashedPassword,
            password
          );

          if (!isValidPassowrd) throw new Error("Invalid credentials");

          return { ...user, image: media?.src };
        } catch (error) {
          //TODO: Return custom error messages
          return null;
        }
      },
    }),
  ],
});
