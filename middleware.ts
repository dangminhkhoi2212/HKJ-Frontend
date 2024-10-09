import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { AUTHORIZATIONS_CONST } from '@/const';

import { routes } from './routes';

// Define a secret to verify the token (make sure to keep it secure)
const secret = process.env.NEXTAUTH_SECRET;

// Middleware function to handle custom role-based URL prefixing
async function customMiddleware(req: NextRequest) {
  const url = new URL(req.url);
  const token = await getToken({ req, secret });

  // If user is not authenticated and the request is not for the sign-in page, redirect to sign-in
  if (!token) {
    if (!url.pathname.startsWith(routes.signIn)) {
      return NextResponse.redirect(new URL(routes.signIn, req.url));
    }
  } else if (token.role) {
    // Role-based URL prefix logic
    const prefix =
      AUTHORIZATIONS_CONST.ROLE_PREFIXES[
        token.role as keyof typeof AUTHORIZATIONS_CONST.ROLE_PREFIXES
      ];

    if (prefix) {
      // Avoid adding prefix if the URL already starts with the prefix
      if (
        !url.pathname.startsWith(prefix) &&
        !url.pathname.startsWith("/_next")
      ) {
        url.pathname = `${prefix}${url.pathname}`;
        return NextResponse.redirect(url);
      }
    }
  }

  // Default response if no redirection is needed
  return NextResponse.next(); // Proceed with the request without redirect
}

// Export the middleware with authentication and custom logic
export default withAuth(customMiddleware, {
  // Define the authorized callback to allow access
  callbacks: {
    authorized({ token }) {
      return !!token; // Ensure the user is authenticated
    },
  },
});

// Middleware configuration
export const config = {
  matcher: [
    "/((?!sign-in|api|static|_next|favicon.ico).*)", // Apply middleware to all routes except API routes, static assets, and Next.js internal paths
  ],
};
