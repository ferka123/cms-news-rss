export const DEFAULT_LOGGEDIN_REDIRECT = "/cms";
export const LOGIN_ROUTE = "/cms/login";
export const API_AUTH_PREFIX = "/api/auth";
export const publicRoutes: string[] = ["/", "/search", "/tags"];
export const authorRoutes: RegExp[] = [
  /^\/cms\/news$/,
  /^\/cms\/news\/[^\/]+$/,
  /^\/cms$/,
];
export const authRoutes: string[] = [LOGIN_ROUTE];
