import { Layout } from "antd";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { Logo } from "@/shared/Logo";

import { UserMenu } from "../../AdminLayout/Content/Header";
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
		<Header className=" bg-white bg-no-repeat object-cover object-center">
			<div className="grid grid-cols-12 gap-5 h-full place-items-center">
				<div className="col-span-1">
					<Logo />
				</div>
				<div className="col-span-4">
					<SearchImage onSearch={onSearch} size="large" />
				</div>
				<div className="col-span-7 place-self-end flex justify-end">
					<UserNavigate />
					<UserMenu />
				</div>
			</div>
		</Header>
	);
};

export default UserHeader;
