export const routesUser = {};
export const routesAdmin = {
  positions: "/admin/positions",
  accounts: "/admin/accounts",
  hire: "/admin/hire",
};

export const routesEmpoloyee = {};

export const routesManager = {
  employees: "/manager/employees",
  order: "/manager/orders",
  draft: "/manager/drafts",
  category: "/manager/categories",
  material: "/manager/materials",
  addMaterial: "/manager/materials/add",
  updateMaterial: (id: string) => `/manager/materials/update/${id}`,
};
export const routes = {
  home: "/",
  profile: "/profile",
  signIn: "/sign-in",
  signOut: "/api/auth/logout",
};
