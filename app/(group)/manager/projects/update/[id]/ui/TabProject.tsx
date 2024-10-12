import { Empty, Spin, Tabs } from "antd";
import React from "react";

import { TProject } from "@/types";

import { updateProjectStore } from "../store";
import { UpdateBasicProject, UpdateProcessing } from "./";

type Props = {};
const renderChildren = (
	project: TProject | null,
	isLoading: boolean,
	children: React.ReactNode
) => {
	if (isLoading) {
		return <Spin />;
	}
	if (!project) {
		return <Empty description="Không có dư liệu" />;
	}
	return children;
};
const TabProject: React.FC<Props> = ({}) => {
	const { tab, setTab, project, isLoading } = updateProjectStore();

	let tabs = [
		{
			label: `Thông tin`,
			key: "1",
			children: renderChildren(
				project,
				isLoading,
				<UpdateBasicProject />
			),
		},
		{
			label: `Quy trình`,
			key: "2",
			children: renderChildren(project, isLoading, <UpdateProcessing />),
		},
	];
	return (
		<Tabs
			defaultActiveKey={tab?.toString()}
			size={"middle"}
			accessKey={tab?.toString()}
			activeKey={tab?.toString()}
			tabIndex={tab!}
			onChange={(key) => setTab(Number.parseInt(key!))}
			style={{ marginBottom: 32 }}
			items={tabs}
		/>
	);
};

export default TabProject;
