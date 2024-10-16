// TabUpdateForm.tsx
"use client";
import { Empty, Spin, Tabs } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { useRouterCustom } from "@/hooks";
import { jewelryService } from "@/services";
import { useQuery } from "@tanstack/react-query";

import { updateJewelryModelStore } from "../store";
import UpdateBasicForm from "./UpdateBasicForm";
import UpdateImagesForm from "./UpdateImagesForm";
import UpdateProjectForm from "./UpdateProjectForm";

const TabUpdateForm: React.FC = () => {
	const params = useParams();
	const setJewelry = updateJewelryModelStore((state) => state.setJewelry);

	const { searchParams } = useRouterCustom();
	const tab = searchParams.get("tab");
	const {
		data: jewelry,
		isError,
		isFetching,
	} = useQuery({
		queryKey: ["jewelry", params.id],
		queryFn: () => jewelryService.getOne(Number(params.id)),
		enabled: !!params.id,
		staleTime: 0,

		// Thêm suspense nếu muốn loading UI được xử lý ở component cha
	});

	const items = [
		{
			key: "basic",
			label: "Thông tin",
			children: <UpdateBasicForm />,
		},
		{
			key: "images",
			label: "Hình ảnh",
			children: <UpdateImagesForm />,
		},
		{
			key: "project",
			label: "Dự án",
			children: <UpdateProjectForm />,
		},
	];
	useEffect(() => {
		if (jewelry) {
			setJewelry(jewelry);
		}
	}, [jewelry, isFetching]);
	if (isError) {
		return <Empty description="Không tìm thấy" />;
	}

	return (
		<Spin spinning={isFetching}>
			<Tabs
				tabPosition="left"
				items={items}
				defaultActiveKey={tab ?? "basic"}
			/>
		</Spin>
	);
};

export default TabUpdateForm;
