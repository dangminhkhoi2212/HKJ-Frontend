import { Divider } from "antd";
import Link from "next/link";
import React from "react";

import { Frame } from "@/shared/Frame";

import AccountList from "./ui/AccountList";
import TimeLineAccount from "./ui/TimeLine";

const AccountPage: React.FC<{}> = () => {
	return (
		<div className="flex flex-col gap-7">
			<Frame title="Hướng dãn đồng bộ tài khoản">
				<TimeLineAccount />
			</Frame>
			<Frame title="Quản lí tài khoản">
				<p>Sử dụng KeyCloak quản lí người dùng và phân quyền. </p>
				<Link
					target="_blank"
					href={process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN || "/error"}
				>
					Mở KeyCloak
				</Link>
			</Frame>
			<div>
				<Divider />
				<AccountList />
			</div>
		</div>
	);
};

export default AccountPage;
