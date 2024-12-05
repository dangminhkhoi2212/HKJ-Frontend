"use client";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { menuUser } from "./menu";

type Props = { mode?: MenuProps["mode"] };
type MenuItem = Required<MenuProps>["items"][number];

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
const UserNavigate: React.FC<Props> = ({ mode = "horizontal" }) => {
	const pathname = usePathname(); // Current path
	const [menus, setMenus] = useState<MenuItem[]>(
		convertMenu(menuUser!) || []
	);

	const [defaultSelectedKey, setDefaultSelectedKey] = useState<
		string | undefined
	>();
	useEffect(() => {
		const menu = menuUser.reverse()?.find((item: MenuItem) => {
			return pathname === item?.key?.toString();
		});
		setDefaultSelectedKey(menu?.key?.toString());
	}, [pathname, menus]);

	return (
		<Menu
			theme="light"
			mode={mode}
			disabledOverflow={true}
			defaultSelectedKeys={[defaultSelectedKey?.toString()!]}
			selectedKeys={[defaultSelectedKey?.toString()!]}
			items={menus}
		/>
	);
};

export default UserNavigate;
