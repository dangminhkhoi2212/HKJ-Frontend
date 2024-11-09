// TabUpdateForm.tsx
"use client";
import { Empty, Spin, Tabs } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { useRouterCustom } from "@/hooks";
import { jewelryService, materialUsageService } from "@/services";
import { useQuery } from "@tanstack/react-query";

import { updateJewelryModelStore } from "../store";
import UpdateBasicForm from "./UpdateJewelryBasicForm";
import UpdateImagesForm from "./UpdateJewelryImagesForm";
import UpdateProjectForm from "./UpdateJewelryProjectForm";

const TabUpdateForm: React.FC = () => {
	const params = useParams();
	const setJewelry = updateJewelryModelStore((state) => state.setJewelry);
	const reset = updateJewelryModelStore((state) => state.reset);

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

	const { data: materials, isFetching: isFetchingMaterials } = useQuery({
		queryKey: ["jewelry-material-usage", params.id],
		queryFn: () =>
			materialUsageService.get({ jewelryId: { equals: jewelry?.id } }),
		enabled: !!jewelry?.id,
		staleTime: 0,
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
		if (jewelry && materials) {
			const newJewelry = {
				...jewelry,
				materials,
			};

			setJewelry(newJewelry!);
		}
		return () => {
			reset();
		};
	}, [jewelry, isFetching, isFetchingMaterials, materials]);
	if (isError) {
		return <Empty description="Không tìm thấy" />;
	}

	return (
		<Spin spinning={isFetching || isFetchingMaterials}>
			<Tabs
				tabPosition="left"
				items={items}
				defaultActiveKey={tab ?? "basic"}
			/>
		</Spin>
	);
};

export default TabUpdateForm;
