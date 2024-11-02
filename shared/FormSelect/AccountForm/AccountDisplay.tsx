import { Descriptions } from "antd";
import React, { memo } from "react";

import { TAccountInfo } from "@/types";

import type { DescriptionsProps } from "antd";
type Props = {
	account: TAccountInfo;
};
const AccountDisplay: React.FC<Props> = ({ account }) => {
	console.log("🚀 ~ account:", account);
	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Họ",
			children: account?.firstName,
			span: 1,
		},
		{
			key: "2",
			label: "Tên",
			children: account?.lastName,
			span: 1,
		},
		{
			key: "3",
			label: "Email",
			children: account?.email,
			span: 1,
		},
		{
			key: "4",
			label: "Số điện thoại",
			children: account?.phone,
			span: 1,
		},

		{
			key: "10",
			label: "Địa chỉ",
			children: account?.address || "Không tìm thấy",
			span: 2,
		},
	];
	return (
		<Descriptions
			layout="vertical"
			bordered
			items={items}
			column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
		/>
	);
};

export default memo(AccountDisplay);
