"use client";
import { Layout } from "antd";
import React from "react";

import { cn } from "@/utils/cn";

import { AppContent } from "./Content";
import { Sidebar } from "./Sidebar";

type Props = { children: React.ReactNode };
const AdminLayout: React.FC<Props> = ({ children }) => {
	return (
		<Layout className={cn("h-screen min-w-[1200px]")} hasSider>
			<Sidebar />
			<AppContent>{children}</AppContent>
		</Layout>
	);
};

export default AdminLayout;
