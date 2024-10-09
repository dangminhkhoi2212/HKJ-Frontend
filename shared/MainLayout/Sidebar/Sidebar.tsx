"use client";
import { Divider, Layout, Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { MenuProps } from "antd/lib";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import { Logo } from "@/shared/Logo";
import useAccountStore from "@/stores/account";
import useStyleStore from "@/stores/style";
import { TAccountInfo } from "@/types";

import { menuAdmin, menuEmployee, menuManager, menuUser } from "./menus";

const { Sider } = Layout;
const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
const renderMenu = (
	role: string | null | undefined
): ItemType<MenuItemType>[] | undefined => {
	console.log("🚀 ~ role:", role);
	console.log(AUTHORIZATIONS.ROLE_EMPLOYEE.toString());

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
const Sidebar: React.FC<{}> = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [menus, setMenus] = useState<ItemType<MenuItemType>[] | undefined>(
		[]
	);
	const account: TAccountInfo | null | undefined = useAccountStore(
		(state) => state.account
	);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState<
		string | undefined
	>(pathname);
	const [selectedKey, setSelectedKey] = useState<string | undefined>(
		defaultSelectedKey
	);
	const collapsed: boolean = useStyleStore((state) => state.collapsed);
	const onClick: MenuProps["onClick"] = (e) => {
		const key: string = e.key;
		setSelectedKey(key);
		router.push(key);
	};
	useEffect(() => {
		// Determine which menu to display based on the current pathname
		const menuItems: ItemType[] | undefined | null = renderMenu(
			account?.authorities![0]
		);
		const defaultSelected: string | undefined =
			(menuItems?.length ?? 0) > 0 ? menuItems![0]?.key?.toString() : "1";
		setMenus(menuItems || []);
		setDefaultSelectedKey(defaultSelected);
	}, [account]);

	// Determine the default selected key by getting the key of the first item in the menu
	return (
		<Sider trigger={null} collapsible theme="light" collapsed={collapsed}>
			<div className="flex justify-center items-center h-[64px]">
				<Logo />
			</div>
			<Divider />
			<Menu
				theme="light"
				mode="inline"
				className=""
				defaultSelectedKeys={[defaultSelectedKey?.toString()!]}
				selectedKeys={
					selectedKey ? [selectedKey?.toString()!] : undefined
				}
				onClick={onClick}
				items={menus}
			/>
		</Sider>
	);
};
export default Sidebar;
