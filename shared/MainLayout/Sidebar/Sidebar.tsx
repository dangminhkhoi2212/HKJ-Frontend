"use client";
import { Divider, Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import { Logo } from "@/shared/Logo";
import useAccountStore from "@/stores/account";
import useStyleStore from "@/stores/style";
import { TAccountInfo } from "@/types";

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
	const [menus, setMenus] = useState<MenuItem[]>([]);
	const account: TAccountInfo | null | undefined = useAccountStore(
		(state) => state.account
	);
	const collapsed: boolean = useStyleStore((state) => state.collapsed);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState<
		string | undefined
	>();
	const [selectedKey, setSelectedKey] = useState<string | undefined>();

	useEffect(() => {
		// Set menu based on the role
		const menuItems: MenuProps["items"] = renderMenu(
			account?.authorities![0]
		);

		// Set the default selected key as the first item in the menu
		const firstPageKey: string | undefined =
			menuItems?.[0]?.key?.toString();
		setMenus(convertMenu(menuItems!) || []);
		setDefaultSelectedKey(firstPageKey); // First menu item as default
		setSelectedKey(
			menus
				?.find((menu) => pathname.includes(menu?.key?.toString()!))
				?.key?.toString()
		); // Highlight the current route
	}, [account, pathname]);

	return (
		<Sider trigger={null} collapsible theme="light" collapsed={collapsed}>
			<div className="flex justify-center items-center h-[64px]">
				<Logo />
			</div>
			<Divider />
			<Menu
				theme="light"
				mode="inline"
				defaultSelectedKeys={[defaultSelectedKey?.toString()!]}
				// selectedKeys={[selectedKey?.toString()!]}
				// openKeys={[selectedKey?.toString()!]}
				defaultOpenKeys={[defaultSelectedKey?.toString()!]}
				items={menus}
			/>
		</Sider>
	);
};

export default Sidebar;
