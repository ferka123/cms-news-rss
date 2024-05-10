import { auth } from "@/auth";
import {
  API_AUTH_PREFIX,
  DEFAULT_LOGGEDIN_REDIRECT,
  LOGIN_ROUTE,
  authRoutes,
  authorRoutes,
  publicRoutes,
} from "./routes";

export default auth((req) => {
  const isLogged = !!req.auth;
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (req.nextUrl.pathname.startsWith(API_AUTH_PREFIX)) return;

  if (isAuthRoute) {
    if (isLogged)
      return Response.redirect(new URL(DEFAULT_LOGGEDIN_REDIRECT, req.nextUrl));
    return;
  }

  if (!isLogged && !isPublicRoute)
    return Response.redirect(new URL(LOGIN_ROUTE, req.nextUrl));

  if (req.auth && !isPublicRoute) {
    if (
      req.auth.user.role === "author" &&
      !authorRoutes.find((regex) => regex.test(req.nextUrl.pathname))
    ) {
      return Response.redirect(new URL(DEFAULT_LOGGEDIN_REDIRECT, req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
