"use client";
import { Tabs } from "antd";
import React from "react";

import { useRouterCustom } from "@/hooks";

import { CoverImageSearchList, ImageSearchList } from "./index";

type Props = {};
export enum TImageSearchTabs {
	Cover = "cover",
	Image = "image",
}
const tabs = [
	{
		label: `Ảnh bìa`,
		key: "0",
		children: <CoverImageSearchList />,
	},
	{
		label: `Ảnh khác`,
		key: "1",
		children: <ImageSearchList />,
	},
];
const ImageSearchTabs: React.FC<Props> = ({}) => {
	const { updatePathname } = useRouterCustom();
	// const handleOnChange = (key: string) => {
	// 	updatePathname({
	// 		query: {
	// 			tab: tabs.find((item) => item.key === key)?.value.toString(),
	// 		},
	// 		type: "replace",
	// 	});
	// };
	return (
		<Tabs
			defaultActiveKey={tabs[0].key.toString()}
			size={"middle"}
			tabPosition="top"
			className="m-0"
			// onChange={(key) => handleOnChange(key)}
			style={{ marginBottom: 32 }}
			items={tabs}
		/>
	);
};

export default ImageSearchTabs;
