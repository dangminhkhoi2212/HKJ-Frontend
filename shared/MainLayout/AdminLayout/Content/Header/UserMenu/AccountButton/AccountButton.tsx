"use client";
import { Button, Divider, Dropdown, Spin, Tag, theme, Tooltip } from "antd";
import { MenuProps } from "antd/lib";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useAccount } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routes } from "@/routes";
import AvatarAccount from "@/shared/Account/AvatarAccount";

const AccountButton: React.FC<{}> = () => {
	const account = useAccountStore((state) => state.account);
	const { signOutAll } = useAccount();

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<Link
					href={routes.profile}
					className="flex flex-col gap-2 justify-center items-center m-0"
				>
					<AvatarAccount />
					<p className="m-0">{account?.email}</p>
				</Link>
			),
		},
	];
	const { useToken } = theme;
	const { token } = useToken();
	const menuStyle: React.CSSProperties = {
		boxShadow: "none",
	};
	const contentStyle: React.CSSProperties = {
		backgroundColor: token.colorBgElevated,
		borderRadius: token.borderRadiusLG,
		boxShadow: token.boxShadowSecondary,
	};

	return (
		<div className="flex justify-center items-center gap-4 ">
			{account ? (
				<Dropdown
					trigger={["click"]}
					placement="bottomRight"
					arrow
					menu={{ items }}
					dropdownRender={(menu) => (
						<div
							style={contentStyle}
							className="flex flex-col justify-center items-center"
						>
							{React.cloneElement(menu as React.ReactElement, {
								style: menuStyle,
							})}
							<Divider className="m-1" />
							<div className="w-full flex justify-center items-center p-2">
								<Button
									htmlType="button"
									className="w-full "
									onClick={() => signOutAll()}
									icon={<LogOut size={14} />}
								>
									Đăng xuất
								</Button>
							</div>
						</div>
					)}
				>
					<Tooltip
						title="Tài khoản"
						className=" cursor-pointer flex  justify-center items-center"
					>
						<Button icon={<UserRound size={14} />} />
						<Tag
							className="hidden md:block text-sm font-semibold p-2 text-center align-middle"
							bordered={false}
						>
							{account.firstName + " " + account.lastName}
						</Tag>
					</Tooltip>
				</Dropdown>
			) : (
				<AvatarAccount>
					<Spin />
				</AvatarAccount>
			)}
		</div>
	);
};

export default AccountButton;
