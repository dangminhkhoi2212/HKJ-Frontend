import { Button, Layout, theme } from "antd";
import React from "react";

import {
	RoleTag,
	UserMenu,
} from "@/shared/MainLayout/AdminLayout/Content/Header";
import useStypeStore from "@/stores/style";
import { cn } from "@/utils/cn";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;
type Props = {};
const AppHeader: React.FC<Props> = () => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const { collapsed } = useStypeStore((state) => state);
	const toggleCollapsed = useStypeStore((state) => state.toggleCollapsed);

	return (
		<Header
			style={{ background: colorBgContainer }}
			className={cn("flex items-center justify-between px-5")}
		>
			<Button
				type="text"
				icon={
					collapsed ? (
						<MenuUnfoldOutlined className="" />
					) : (
						<MenuFoldOutlined className="" />
					)
				}
				onClick={() => toggleCollapsed()}
				style={{
					fontSize: "16px",
					width: 32,
					height: 32,
				}}
			/>
			<div className="flex justify-center items-center gap-4">
				<RoleTag />
				<UserMenu />
			</div>
		</Header>
	);
};

export default AppHeader;
