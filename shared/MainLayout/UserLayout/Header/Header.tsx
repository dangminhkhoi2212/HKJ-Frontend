import { Divider, Layout, Space } from "antd";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { Logo } from "@/shared/Logo";

import { UserMenu } from "../../AdminLayout/Content/Header";
import { CartButton } from "./CartButton";
import { UserNavigate } from "./Navigate";
import SearchImage from "./SearchImage";

type Props = {};
const { Header } = Layout;
const UserHeader: React.FC<Props> = ({}) => {
	const { router, updatePathname } = useRouterCustom();
	const onSearch = (value: string) => {
		const newUrl = updatePathname({
			url: routesUser.product,
			query: { textSearch: value },
		});
		router.push(newUrl);
	};
	return (
		<div className=" flex flex-col justify-stretch items-center w-full shadow-sm z-50">
			<div className="py-2 grid grid-cols-6 gap-5 h-full place-items-center">
				<div className="col-span-2">
					<SearchImage onSearch={onSearch} size="middle" />
				</div>
				<div className="col-span-2">
					<Logo className="h-8 " />
				</div>
				<div className="col-span-2">
					<Space size={"middle"}>
						<CartButton />
						<UserMenu />
					</Space>
				</div>
			</div>
			<Divider className="m-0 p-0 w-[80%]" />
			<div className=" flex flex-col justify-center items-center ">
				<UserNavigate />
			</div>
		</div>
	);
};

export default UserHeader;
