"use client";
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/utils/cn';

import { AppContent } from './AdminLayout/Content';
import { Sidebar } from './AdminLayout/Sidebar';
import UserLayout from './UserLayout/UserLayout';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();
	if (pathname.startsWith("/user"))
		return <UserLayout>{children}</UserLayout>;
	return (
		<Layout className={cn("min-h-screen")} hasSider>
			<Sidebar />
			<AppContent>{children}</AppContent>
		</Layout>
	);
};

export default MainLayout;
