"use client";
import { Divider, Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { Logo } from "@/shared/Logo";
import useStyleStore from "@/stores/style";

import { menuAdmin, menuEmployee, menuManager, menuUser } from "./menus";

const { Sider } = Layout;
const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
type MenuItem = Required<MenuProps>["items"][number];

// Helper to render the correct menu based on the role
const renderMenu = (role: string | null | undefined): MenuProps["items"] => {
	switch (role) {
		case AUTHORIZATIONS.ROLE_USER.toString():
			return menuUser;
		case AUTHORIZATIONS.ROLE_EMPLOYEE.toString():
			return menuEmployee;
		case AUTHORIZATIONS.ROLE_MANAGER.toString():
			return menuManager;
		case AUTHORIZATIONS.ROLE_ADMIN.toString():
			return menuAdmin;
		default:
			return [];
	}
};

const convertMenu = (menu: MenuItem[]): MenuItem[] => {
	return menu.map((item: MenuItem) => {
		if ("label" in item!) {
			return {
				...item,
				label: <Link href={item?.key?.toString()!}>{item.label}</Link>,
			} as MenuItem;
		} else {
			return item;
		}
	});
};

const Sidebar: React.FC<{}> = () => {
	const pathname = usePathname(); // Current path
	const account = useAccountStore((state) => state.account);
	const collapsed = useStyleStore((state) => state.collapsed);

	// Memoized menus based on the user's role
	const menus = useMemo(() => {
		if (account) {
			const menuItems: MenuProps["items"] = renderMenu(
				account.authorities![0]
			);
			return convertMenu(menuItems || []);
		}
		return [];
	}, [account]);

	// Dynamically set the default selected key
	const defaultSelectedKey = useMemo(() => {
		const matchedItem = menus?.reverse()?.find((item: MenuItem) => {
			return pathname.startsWith(item?.key?.toString()!);
		});
		return matchedItem?.key?.toString() || menus?.[0]?.key?.toString();
	}, [menus, pathname]);

	return (
		<Sider trigger={null} collapsible theme="light" collapsed={collapsed}>
			<div className="flex justify-center items-center h-[64px]">
				<Logo />
			</div>
			<Divider />
			<Menu
				theme="light"
				mode="inline"
				selectedKeys={[defaultSelectedKey!]}
				items={menus}
			/>
		</Sider>
	);
};

export default Sidebar;
