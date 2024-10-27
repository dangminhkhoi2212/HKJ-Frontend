"use client";
import { Tabs } from "antd";
import React, { useState } from "react";

import { useRouterCustom } from "@/hooks";
import { TStatus } from "@/types";

type Props = {};
const tabs = [
	{
		label: `Mới`,
		key: "0",
		value: TStatus.NEW,
	},
	{
		label: `Đang xử lý`,
		key: "1",
		value: TStatus.IN_PROCESS,
	},
	{
		label: `Đã giao`,
		key: "2",
		value: TStatus.DELIVERED,
	},
	{
		label: `Hủy`,
		key: "3",
		value: TStatus.CANCEL,
	},
	{
		label: `Trễ`,
		key: "4",
		value: TStatus.LATED,
	},
];
const OrderTab: React.FC<Props> = ({}) => {
	const [tab, setTab] = useState<number>(0);
	const { updatePathname } = useRouterCustom();
	const handleOnChange = (key: string) => {
		const item = tabs.find((item) => {
			return item.key === key;
		});
		console.log("🚀 ~ handleOnChange ~ item:", item);
		updatePathname({ query: { status: item?.value } });
	};
	return (
		<Tabs
			defaultActiveKey={tabs[0].key.toString()}
			size={"middle"}
			tabPosition="top"
			className="m-0"
			onChange={(key) => handleOnChange(key)}
			style={{ marginBottom: 32 }}
			items={tabs}
		/>
	);
};

export default OrderTab;
