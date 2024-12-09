"use client";

import {
	Button,
	Select,
	Space,
	Table,
	TablePaginationConfig,
	TableProps,
} from "antd";
import { Pencil, RotateCcw } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TPriority, TProject, TProjectQuery, TQuery, TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { projectStore } from "../store";
import ProjectDeleteButton from "./ProjectDeleteButton";

const {
	TStatusColorMapper,
	TPriorityColorMapper,
	TPriorityMapper,
	TStatusMapper,
} = tagMapperUtil;
type TProps = {};
const { defaultQuery } = QUERY_CONST;
const ProjectList: React.FC<TProps> = () => {
	const { setProjectDelete, reset } = projectStore();
	const [query, setQuery] = useState<TQuery<TProjectQuery>>({
		...defaultQuery,
	});
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
	const refresh = useCallback(() => {
		refetch();
		refetchCount();
	}, []);

	const columns: TableProps<TProject>["columns"] = useMemo(() => {
		return [
			{
				title: "Dự án",
				dataIndex: "name",
				key: "name",
			},

			{
				title: "Tạo bởi",
				dataIndex: "createdBy",
				key: "createdBy",
				width: 150,
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
				fixed: "right",
				render: (_, record) => (
					<Space>
						<Link href={routesManager.updateProject(record.id)}>
							<Button icon={<Pencil size={16} />} />
						</Link>
						<ProjectDeleteButton
							project={record}
							refresh={refresh}
						/>
					</Space>
				),
			},
		];
	}, [refresh, routesManager]);

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
				<Select
					options={Object.entries(TStatus).map(([key, value]) => ({
						label: TStatusMapper(value),
						value: key,
					}))}
					className="min-w-28"
					onChange={(value) => {
						setQuery((pre) => ({
							...pre,
							page: 0,
							status: { equals: value },
						}));
					}}
					placeholder="Trạng thái"
					allowClear
				/>
				<Select
					options={Object.entries(TPriority).map(([key, value]) => ({
						label: TPriorityMapper(value),
						value: key,
					}))}
					className="min-w-28"
					onChange={(value) => {
						setQuery((pre) => ({
							...pre,
							page: 0,
							priority: { equals: value },
						}));
					}}
					placeholder="Độ ưu tiên"
					allowClear
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
				scroll={{ x: "max-content" }}
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
