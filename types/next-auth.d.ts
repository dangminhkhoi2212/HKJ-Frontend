import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    access_token: string;
    refresh_token: string;
    error: string;
    id_token: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Add roles field here
    };
  }
}
