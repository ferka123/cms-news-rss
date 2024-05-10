"use server";

import { signIn, signOut } from "@/auth";
import { signInSchema } from "./schemas";
import { DEFAULT_LOGGEDIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { z } from "zod";

type State = {
  validationErrors?: z.inferFlattenedErrors<typeof signInSchema>["fieldErrors"];
  serverError?: string;
};

export const login = async (prevState: State, data: FormData) => {
  const parsedData = signInSchema.safeParse(Object.fromEntries(data.entries()));

  if (!parsedData.success)
    return { validationErrors: parsedData.error.formErrors.fieldErrors };

  try {
    await signIn("credentials", {
      ...parsedData.data,
      redirectTo: DEFAULT_LOGGEDIN_REDIRECT,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { serverError: "Invalid Credentials" };
      }
      return { serverError: "Something went wrong" };
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
