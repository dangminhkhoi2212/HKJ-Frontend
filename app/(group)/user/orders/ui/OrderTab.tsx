"use client";
import { Tabs } from "antd";
import React, { useEffect, useState } from "react";

import { useRouterCustom } from "@/hooks";
import { TStatus } from "@/types";

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
		label: `Hoàn thành`,
		key: "2",
		value: TStatus.COMPLETED,
	},
	{
		label: `Đã giao`,
		key: "3",
		value: TStatus.DELIVERED,
	},
	{
		label: `Hủy`,
		key: "4",
		value: TStatus.CANCEL,
	},
	// {
	// 	label: `Trễ`,
	// 	key: "5",
	// 	value: TStatus.LATED,
	// },
];

const OrderTab: React.FC = () => {
	const [activeKey, setActiveKey] = useState<string>(tabs[0].key);
	const { updatePathname, searchParams } = useRouterCustom();

	const handleOnChange = (key: string) => {
		const item = tabs.find((tab) => tab.key === key);
		if (item) {
			updatePathname({ query: { status: item.value } });
		}
	};

	useEffect(() => {
		const status = searchParams.get("status") as TStatus | null;
		const matchedTab = tabs.find((tab) => tab.value === status);
		if (matchedTab) {
			setActiveKey(matchedTab.key);
		}
	}, [searchParams]);

	return (
		<Tabs
			activeKey={activeKey}
			onChange={handleOnChange}
			size="middle"
			tabPosition="top"
			style={{ marginBottom: 10, marginTop: 0 }}
			items={tabs.map((tab) => ({
				key: tab.key,
				label: tab.label,
			}))}
		/>
	);
};

export default OrderTab;
