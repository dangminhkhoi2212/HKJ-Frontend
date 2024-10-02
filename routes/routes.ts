export const routesUser = {};
export const routesAdmin = {
  positions: "/admin/positions",
  accounts: "/admin/accounts",
  hire: "/admin/hire",
};

export const routesEmpoloyee = {};

export const routesManager = {
  employees: "/manager/employees",
  order: "/manager/order",
  material: "/manager/material",
  addMaterial: "/manager/material/add",
  updateMaterial: (id: string) => `/manager/material/update/${id}`,
};
export const routes = {
  home: "/",
  profile: "/profile",
  signIn: "/sign-in",
  signOut: "/api/auth/logout",
};
