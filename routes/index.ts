interface CommonRoutes {
  home: string;
  signIn: string;
  signUp: string;
  resetPassword: string;
  resetPasswordFinish: string;
  profile: string;
  verifyAccount: string;
}

const routes: CommonRoutes = {
  home: "/",
  signIn: "/account/sign-in",
  signUp: "/account/sign-up",
  resetPassword: "/account/reset-password",
  resetPasswordFinish: "/account/reset-password/finish",
  profile: "/account/profile",
  verifyAccount: "/account/verify-account",
};

export default routes;
