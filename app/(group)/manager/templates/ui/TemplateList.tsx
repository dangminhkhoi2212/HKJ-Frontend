"use client";

import { Button, Space, Spin, Table, TableProps, Tag } from "antd";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import templateService from "@/services/templateService";
import templateStepService from "@/services/templateStepService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TTemplate, TTemplateStep } from "@/types";
import { formatUtil } from "@/utils";
import { useMutation, useQueries } from "@tanstack/react-query";

import { templateStore } from "../store";

type TProps = {};

const TemplateList: React.FC<TProps> = () => {
	const {
		setOpenDrawer,
		pagination,
		setQuery,
		query,
		setPagination,
		setToggleRefresh,
		setTemplateDelete,
		setTemplateUpdate,
	} = templateStore();

	// Track expanded rows and their data
	const [expandedData, setExpandedData] = useState<
		Record<number, TTemplateStep[]>
	>({});
	// Track which row keys are expanded
	const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
	const [
		{
			data: templates,
			refetch: refreshTemplate,
			isLoading: isLoadingCategories,
		},
		{
			data: templatesCount,
			refetch: refreshTemplatesCount,
			isLoading: isLoadingTemplatesCount,
			isSuccess: isSuccessTemplatesCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["templates", { ...query }],
				queryFn: () => templateService.get(query),
			},
			{
				queryKey: ["templates-count", { ...query }],
				queryFn: () => templateService.getCount(query),
			},
		],
	});

	useEffect(() => {
		if (isSuccessTemplatesCount)
			setPagination({ ...pagination, total: templatesCount as number });
	}, [templatesCount, refreshTemplatesCount]);

	const handleTableChange: TableProps<TTemplate>["onChange"] = (
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

	const columns: TableProps<TTemplate>["columns"] = [
		{
			title: "Bản mẫu",
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
							setTemplateUpdate(record);
							setOpenDrawer(true);
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

	const { mutate, isPending } = useMutation({
		mutationFn: (id: number) =>
			templateStepService.get({
				hkjTemplateId: { equals: id },
			}),
		onSuccess: (data, variables) => {
			setExpandedData((prev) => ({
				...prev,
				[variables]: data,
			}));
		},
	});

	// Handle expanded row changes
	const handleExpand = (expanded: boolean, record: TTemplate) => {
		// Update expanded row keys
		setExpandedRowKeys(expanded ? [record.id] : []);

		// Fetch data if needed
		if (expanded && !expandedData[record.id]) {
			mutate(record.id);
		}
	};
	const refresh = useCallback(() => {
		refreshTemplate();
		refreshTemplatesCount();
	}, []);
	const isLoading =
		isPending || isLoadingCategories || isLoadingTemplatesCount;
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
					placeholder="Tìm kiếm bản mẫu"
					handleSearch={handleOnChangeSearch}
				/>
			</Space>

			<Table
				columns={columns}
				dataSource={templates}
				loading={isLoading}
				pagination={pagination}
				onChange={handleTableChange}
				expandable={{
					expandedRowRender: (record) => {
						if (isLoading) return <Spin />;
						const steps = expandedData[record.id] || [];
						return (
							<div>
								{steps.map((item: TTemplateStep) => (
									<Tag key={item.id}>{item.name}</Tag>
								))}
							</div>
						);
					},
					onExpand: handleExpand,
					expandedRowKeys: expandedRowKeys,
				}}
				rowKey="id"
			/>
		</div>
	);
};

export default TemplateList;
