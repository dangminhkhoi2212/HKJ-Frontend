import { AUTHORIZATIONS } from "@/const";

interface CommonRoutes {
  home: string;
  signIn: string;
  signOut: string;
  signUp: string;
  resetPassword: string;
  resetPasswordFinish: string;
  profile: string;
  verifyAccount: string;
}

export const routesUser: CommonRoutes = {
  home: "/",
  signIn: "/api/auth/sign-in",
  signOut: "/api/auth/logout",
  signUp: "/api/auth/logout",
  resetPassword: "/account/reset-password",
  resetPasswordFinish: "/account/reset-password/finish",
  verifyAccount: "/account/verify-account",
  profile: "/profile",
};

export const routesEmpoloyee = {
  home: "/",
};

export const routesManager = {
  home: "/",
  employees: "/employees",
  order: "/order",
};
export const routes = {
  home: "/",
  signIn: "/sign-in",
  signOut: "/api/auth/logout",
};
