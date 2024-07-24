interface CommonRoutes {
  home: string;
  signIn: string;
  signUp: string;
  resetPassword: string;
}

interface Routes extends CommonRoutes {
  [key: string]: string;
}

const routes: Routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  resetPassword: "/reset-password",
};

export default routes;
