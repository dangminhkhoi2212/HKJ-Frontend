"use client";
import { usePathname } from "next/navigation";
import React from "react";

import AdminLayout from "./AdminLayout/AdminLayout";
import { UserLayout } from "./UserLayout";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();
	if (pathname === null) {
		throw new Error("pathname is null");
	}
	if (pathname.startsWith("/user")) {
		return <UserLayout>{children}</UserLayout>;
	}
	return <AdminLayout>{children}</AdminLayout>;
};
export default MainLayout;
