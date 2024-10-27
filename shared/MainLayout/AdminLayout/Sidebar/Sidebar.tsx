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

	useEffect(() => {
		const menuItems: MenuProps["items"] = renderMenu(
			account?.authorities![0]
		);

		setMenus(convertMenu(menuItems!) || []);
		const menu = menuItems?.find((item: MenuItem) => {
			return (
				pathname === item?.key?.toString() ||
				pathname.startsWith(item?.key?.toString()!)
			);
		});
		setDefaultSelectedKey(
			menu?.key?.toString() || menuItems![0]?.key?.toString()
		);
	}, [pathname]);

	if (!defaultSelectedKey) return <></>;
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
				defaultOpenKeys={[defaultSelectedKey?.toString()!]}
				items={menus}
			/>
		</Sider>
	);
};

export default Sidebar;
