import { auth } from "@/auth";
import { DEFAULT_SERVER_ERROR, createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {}

const handleReturnedServerError = (e: Error) => {
  if (e instanceof ActionError) {
    return e.message;
  }

  return DEFAULT_SERVER_ERROR;
};

export const action = createSafeActionClient({
  handleReturnedServerError,
});

export const authAction = createSafeActionClient({
  async middleware() {
    const session = await auth();

    if (!session) {
      throw new ActionError("Session not found!");
    }

    return { session };
  },
  handleReturnedServerError,
});

export const adminAction = createSafeActionClient({
  async middleware() {
    const session = await auth();

    if (!session) {
      throw new ActionError("Session not found!");
    }

    if (!session.user?.role || session.user.role !== "admin") {
      throw new ActionError("Forbidden action");
    }

    return { session };
  },
  handleReturnedServerError,
});
