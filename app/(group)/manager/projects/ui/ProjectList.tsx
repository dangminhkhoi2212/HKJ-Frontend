"use client";

import { Button, Space, Table, TableProps } from "antd";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import React from "react";
import { useQuery } from "react-query";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TProject } from "@/types";
import { formatUtil } from "@/utils";

import { projectStore } from "../store";

type TProps = {};

const ProjectList: React.FC<TProps> = () => {
	const {
		setOpenDrawer,
		pagination,
		setQuery,
		query,
		setPagination,
		setToggleRefresh,
		setTemplateDelete,
		setTemplateUpdate,
	} = projectStore();

	const { router } = useRouterCustom();

	const handleTableChange: TableProps<TProject>["onChange"] = (
		pagination,
		filters,
		sorter
	) => {
		setQuery({
			...query,
			page: pagination.current! - 1,
		});
		setPagination(pagination);
	};

	const handleOnChangeSearch = (value: string) => {
		setQuery({
			...query,
			name: {
				contains: value,
			},
		});
	};

	const columns: TableProps<TProject>["columns"] = [
		{
			title: "Dự án",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Loại",
			dataIndex: "category",
			key: "category",
			render: (value) => value?.name,
		},
		{
			title: "Tạo bởi",
			dataIndex: "createdBy",
			key: "createdBy",
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdDate",
			key: "createdDate",
			render: (value) => formatUtil.formatDate(value),
		},
		{
			title: "Ngày chỉnh sửa",
			dataIndex: "lastModifiedDate",
			key: "lastModifiedDate",
			render: (value) => formatUtil.formatDate(value),
		},
		{
			title: "Tùy chọn",
			dataIndex: "actions",
			key: "actions",
			render: (_, record) => (
				<Space>
					<Button
						type="text"
						icon={<Pencil size={16} />}
						onClick={() => {
							router.push(routesManager.updateProject(record.id));
						}}
					/>
					<Button
						type="text"
						danger
						icon={<Trash size={16} />}
						onClick={() => {
							setTemplateDelete(record);
						}}
					/>
				</Space>
			),
		},
	];

	// Handle expanded row changes

	const { data, refetch, isLoading } = useQuery({
		queryKey: ["projects", { ...query }],
		queryFn: () => projectService.get(query),
	});

	return (
		<div>
			<Space className="mb-4">
				<Button
					icon={<RotateCcw size={16} />}
					onClick={() => setToggleRefresh()}
				>
					Làm mới
				</Button>
				<InputSearchCustom
					placeholder="Tìm kiếm dự án"
					handleSearch={handleOnChangeSearch}
				/>
			</Space>

			<Table
				columns={columns}
				dataSource={data!}
				loading={isLoading}
				pagination={pagination}
				onChange={handleTableChange}
				// expandable={{
				// 	expandedRowRender: (record) => {
				// 		if (isLoading) return <Spin />;
				// 		const steps = expandedData[record.id] || [];
				// 		return (
				// 			<div>
				// 				{steps.map((item: TTemplateStep) => (
				// 					<Tag key={item.id}>{item.name}</Tag>
				// 				))}
				// 			</div>
				// 		);
				// 	},
				// 	onExpand: handleExpand,
				// 	expandedRowKeys: expandedRowKeys,
				// }}
				rowKey="id"
			/>
		</div>
	);
};

export default ProjectList;
