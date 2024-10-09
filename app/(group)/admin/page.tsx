"use client";
import { useEffect } from "react";

import { useRouterCustom } from "@/hooks";
import { routesAdmin } from "@/routes";

const AdminPage: React.FC<{}> = () => {
	const { router, pathname } = useRouterCustom();
	useEffect(() => {
		if (pathname === "/admin") {
			router.push(routesAdmin.accounts);
		}
	}, []);
	return <div></div>;
};

export default AdminPage;
