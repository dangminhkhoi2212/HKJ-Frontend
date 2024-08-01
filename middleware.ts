import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_TOKEN_KEY } from "./config/key";
import routes from "./routes";

// Paths that should not trigger the middleware
export const excludedPaths = [
  routes.signIn,
  routes.signUp,
  routes.resetPassword,
  routes.resetPasswordFinish,
  routes.verifyAccount,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path is excluded, let the request pass
  if (excludedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for the authentication cookie
  const authToken = request.cookies.get(AUTH_TOKEN_KEY);

  // If the token is not present, redirect to the sign-in page
  if (!authToken) {
    return NextResponse.redirect(new URL(routes.signIn, request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next|favicon.ico).*)", // Exclude Next.js internals and favicon
};
