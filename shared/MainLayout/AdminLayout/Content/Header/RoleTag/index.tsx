import { Tag } from "antd";
import React from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { TAccountInfo } from "@/types";

const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
const RoleTag: React.FC<{}> = () => {
	const account: TAccountInfo | null | undefined = useAccountStore(
		(state) => state.account
	);
	if (!account) return <></>;
	switch (account!.authorities![0]) {
		case AUTHORIZATIONS.ROLE_ADMIN:
			return <Tag color="blue">Quản trị viên</Tag>;

		case AUTHORIZATIONS.ROLE_MANAGER:
			return <Tag color="green">Quản lý</Tag>;
		default:
			<></>;
	}
};

export default RoleTag;
