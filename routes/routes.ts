export const routesUser = {
	cart: "/user/cart",
	home: "/user",
	profile: "/user/profile",
	product: "/user/products",
	productDetail: (id: string | number) => `/user/products/${id}`,
	order: `/user/orders`,
	orderDetail: (orderId: string | number) => `/user/orders/${orderId}`,
	createOrder: "/user/orders/create",
};
export const routesAdmin = {
	positions: "/admin/positions",
	accounts: "/admin/accounts",
	hire: "/admin/hire",
	imageSearch: "/admin/images-search",
};

export const routesEmpoloyee = {
	home: "/employee/tasks",
};

export const routesManager = {
	employees: "/manager/employees",
	order: "/manager/orders",
	template: "/manager/templates",
	category: "/manager/categories",
	material: "/manager/materials",
	addMaterial: "/manager/materials/add",
	jewelry: "/manager/jewelry-models",
	updateMaterial: (id: string | number) => `/manager/materials/update/${id}`,
	updateOrder: (id: string | number) => `/manager/orders/update/${id}`,

	createJewelry: "/manager/jewelry-models/create",
	updateJewelry: (id: string | number) =>
		`/manager/jewelry-models/update/${id}`,

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
