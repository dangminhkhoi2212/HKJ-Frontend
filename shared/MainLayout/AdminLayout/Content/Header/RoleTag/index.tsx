import { Tag } from "antd";
import React from "react";

import { AUTHORIZATIONS_CONST } from "@/const";
import useAccountStore from "@/stores/account";
import { TAccountInfo } from "@/types";

const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
const RoleTag: React.FC<{}> = () => {
	const account: TAccountInfo | null | undefined = useAccountStore(
		(state) => state.account
	);
	if (!account) return <></>;
	switch (account!.authorities![0]) {
		case AUTHORIZATIONS.ROLE_ADMIN:
			return <Tag color="blue">{AUTHORIZATIONS.ROLE_ADMIN}</Tag>;
		case AUTHORIZATIONS.ROLE_USER:
			return <Tag color="yellow">{AUTHORIZATIONS.ROLE_USER}</Tag>;
		case AUTHORIZATIONS.ROLE_EMPLOYEE:
			return <Tag color="green">{AUTHORIZATIONS.ROLE_EMPLOYEE}</Tag>;
		default:
			break;
	}
};

export default RoleTag;
