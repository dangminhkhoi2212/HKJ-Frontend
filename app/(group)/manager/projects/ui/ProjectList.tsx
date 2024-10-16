"use client";

import { Button, Space, Table, TablePaginationConfig, TableProps } from "antd";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TProject } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { projectStore } from "../store";

const { TPriorityColorMapper, TStatusColorMapper } = tagMapperUtil;
type TProps = {};

const ProjectList: React.FC<TProps> = () => {
	const { setQuery, query, setToggleRefresh, setTemplateDelete, reset } =
		projectStore();

	const { router } = useRouterCustom();
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		...QUERY_CONST.initPagination,
		total: 0,
	});
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
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
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
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render(value, record, index) {
				return TStatusColorMapper(value);
			},
		},
		{
			title: "Ưu tiên",
			dataIndex: "priority",
			key: "priority",
			render(value, record, index) {
				return TPriorityColorMapper(value);
			},
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
					<Link href={routesManager.updateProject(record.id)}>
						<Button type="primary" icon={<Pencil size={16} />} />
					</Link>
					<Button
						type="primary"
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

	const { data, refetch, isPending, isFetching } = useQuery({
		queryKey: ["projects", { ...query }],
		queryFn: () => projectService.get(query),
	});
	const {
		data: count,
		refetch: refetchCount,
		isPending: isLoadingCount,
		isFetching: isFetchingCount,
	} = useQuery({
		queryKey: ["projects-count", { ...query }],
		queryFn: () => projectService.getCount(query),
	});
	const refresh = useCallback(() => {
		refetch();
		refetchCount();
	}, []);

	return (
		<div>
			<Space className="mb-4">
				<Button
					icon={<RotateCcw size={16} />}
					onClick={() => refresh()}
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
				loading={
					isPending || isLoadingCount || isFetching || isFetchingCount
				}
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
