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
	template: "/manager/templates",
	category: "/manager/categories",
	material: "/manager/materials",
	addMaterial: "/manager/materials/add",
	jewelry: "/manager/jewelry-models",
	createJewelry: "/manager/jewelry-models/create",
	updateMaterial: (id: string) => `/manager/materials/update/${id}`,

	project: "/manager/projects",
	createProject: "/manager/projects/create",
	updateProject: (id: string | number) => `/manager/projects/update/${id}`,
};
export const routes = {
	home: "/",
	profile: "/profile",
	signIn: "/sign-in",
	signOut: "/api/auth/logout",
};
