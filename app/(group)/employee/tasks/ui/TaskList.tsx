"use client";
import { Button, Select, Space, Table, TablePaginationConfig, TableProps } from 'antd';
import { Pen, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';

import { QUERY_CONST } from '@/const';
import taskService from '@/services/taskService';
import { InputSearchCustom } from '@/shared/FormCustom/InputSearchCustom';
import { TPriority, TQuery, TStatus, TTask, TTaskQuery } from '@/types';
import { formatUtil, sortUtil, tagMapperUtil } from '@/utils';
import { useQueries } from '@tanstack/react-query';

type Props = {
	query: TQuery<TTaskQuery>;
};
const {
	TStatusColorMapper,
	TPriorityColorMapper,
	TPriorityMapper,
	TStatusMapper,
} = tagMapperUtil;
const TaskList: React.FC<Props> = ({ query: queryProp }) => {
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		...QUERY_CONST.initPagination,
		total: 0,
	});
	const [query, setQuery] = useState<TQuery<TTaskQuery>>({ ...queryProp });
	const [getTasks, getTasksCount] = useQueries({
		queries: [
			{
				queryKey: ["tasks", query], // Pass the query state as part of the key
				queryFn: () => taskService.get(query),
			},
			{
				queryKey: ["tasks-count", query], // Use the same query object for count
				queryFn: () => taskService.getCount(query),
			},
		],
	});

	const handleTableChange: TableProps<TTask>["onChange"] = (
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

	const refresh = () => {
		getTasks.refetch();
		getTasksCount.refetch();
	};
	const columns: TableProps<TTask>["columns"] = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			width: 80,
			sorter: (a, b) => sortUtil.sortNumber(a.id, b.id),
		},
		{
			title: "Công việc",
			dataIndex: "name",
			key: "name",
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
			title: "Ngày bắt đầu",
			dataIndex: "assignedDate",
			key: "assignedDate",
			sorter: (a, b) => sortUtil.sortDate(a.assignedDate, b.assignedDate),
			render(value, record, index) {
				return (
					<div>
						{formatUtil.formatDate(value, { removeTime: true })}
					</div>
				);
			},
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "expectDate",
			key: "expectDate",
			sorter: (a, b) => sortUtil.sortDate(a.expectDate, b.expectDate),
			render(value, record, index) {
				return (
					<div>
						{formatUtil.formatDate(value, { removeTime: true })}
					</div>
				);
			},
		},
		{
			title: "Ngày hoàn thành",
			dataIndex: "completedDate",
			key: "completedDate",
			sorter: (a, b) =>
				sortUtil.sortDate(a.completedDate, b.completedDate),
			render(value, record, index) {
				if (!value) return "Chưa hoàn thành";
				return (
					<div>
						{formatUtil.formatDate(value, { removeTime: true })}
					</div>
				);
			},
		},

		{
			title: "Thao tác",
			dataIndex: "action",
			key: "action",
			fixed: "right",
			width: 100,
			render(value, record, index) {
				return <Button icon={<Pen size={18} />}></Button>;
			},
		},
	];

	return (
		<Space direction="vertical" className="flex">
			<Space>
				<Button
					onClick={() => {
						refresh();
					}}
					icon={<RotateCcw size={18} />}
				>
					Làm mới
				</Button>
				<InputSearchCustom
					handleSearch={(value) => {
						setQuery((pre) => ({
							...pre,
							page: 0,
							name: { contains: value },
						}));
					}}
				/>
				<Select
					options={Object.entries(TStatus).map(([key, value]) => ({
						label: TStatusMapper(value),
						value: key,
					}))}
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
				dataSource={getTasks.data!}
				loading={getTasks.isFetching || getTasksCount.isFetching}
				pagination={pagination}
				onChange={handleTableChange}
				scroll={{
					x: 1500,
				}}
				rowKey="id"
			/>
		</Space>
	);
};

export default TaskList;
