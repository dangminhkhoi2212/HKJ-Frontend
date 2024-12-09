"use client";
import { Button, DatePicker, Space, Table, TableProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import scheduleService from "@/services/scheduleService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { SelectStatusForm } from "@/shared/FormSelect";
import { TSchedule, TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

const columns: TableProps<TSchedule>["columns"] = [
	{
		title: "Mã công việc",
		dataIndex: "id",
		key: "id",
		width: 150,
	},

	{
		title: "Công việc",
		dataIndex: "name",
		key: "name",
		render(value, record, index) {
			return <p>{value}</p>;
		},
	},
	{
		title: "Họ",
		dataIndex: "first_name",
		key: "firstName",
		render(value, record, index) {
			return <p>{value}</p>;
		},
	},
	{
		title: "Tên",
		dataIndex: "last_name",
		key: "lastName",
		render(value, record, index) {
			return <p>{value}</p>;
		},
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
		title: "Độ ưu tiên",
		dataIndex: "priority",
		key: "priority",
		render(value, record, index) {
			return TPriorityColorMapper(value);
		},
	},

	{
		title: "Ngày giao việc",
		dataIndex: "assigned_date",
		key: "assigned_date",
		width: 150,
		render(value, record, index) {
			return formatUtil.formatDate(value, { removeTime: true });
		},
	},
	{
		title: "Hạn công việc",
		dataIndex: "expect_date",
		key: "expect_date",
		width: 150,
		render(value, record, index) {
			return formatUtil.formatDate(value, { removeTime: true });
		},
	},
	{
		title: "Ngày hoàn thành",
		dataIndex: "completed_date",
		key: "completed_date",
		width: 150,
		render(value, record, index) {
			return formatUtil.formatDate(value);
		},
	},
	// {
	// 	title: "Tùy chọn",
	// 	dataIndex: "action",
	// 	key: "action",
	// 	render(value, record, index) {
	// 		return <p>{value}</p>;
	// 	},
	// },
];
const { TStatusColorMapper, TPriorityColorMapper } = tagMapperUtil;
const ScheduleList: React.FC = () => {
	const [query, setQuery] = React.useState<{
		text_search?: string;
		date: string;
		status_search: TStatus;
	}>({
		text_search: "",
		date: dayjs().toISOString(),
		status_search: TStatus.IN_PROCESS,
	});
	console.log("🚀 ~ query:", query);
	const { updatePathname, searchParams } = useRouterCustom();
	const [pagination, setPagination] = useState({
		...QUERY_CONST.initPagination,
	});

	const [
		{
			data: schedule,
			refetch: refetchSchedule,
			isFetching: isLoadingSchedule,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["schedule", { ...query }],
				queryFn: () => scheduleService.getSchedule(query),
			},
		],
	});

	// const handleTableChange: TableProps<TOrder>["onChange"] = (
	// 	pagination,
	// 	filters,
	// 	sorter
	// ) => {
	// 	setQuery({
	// 		...query,
	// 		page: pagination.current! - 1,
	// 	});
	// 	setPagination(pagination);
	// };
	const refresh = useCallback(() => {
		refetchSchedule();
	}, []);

	useEffect(() => {
		const status = searchParams.get("status");

		setQuery((pre) => ({ ...pre, status: { equals: status }, page: 0 }));
	}, [searchParams]);
	const onChangeStaus = (value: TStatus) => {
		// setQuery((pre) => ({ ...pre, page: 0, status: { equals: value } }));
		// updatePathname({ query: { status: value }, type: "replace" });
		setQuery((pre) => ({ ...pre, status_search: value }));
	};

	const onChangeOrderDate = (value: any) => {
		const [start, end] = value || [undefined, undefined];

		setQuery((pre) => ({
			...pre,
			page: 0,
			orderDate: {
				greaterThanOrEqual: start
					? dayjs(start).toISOString()
					: undefined,
				lessThanOrEqual: end
					? dayjs(end).add(1, "day").toISOString()
					: undefined,
			},
		}));
	};
	const onChangeDeliveryDate = (value: any) => {
		const [start, end] = value || [undefined, undefined];

		setQuery((pre) => ({
			...pre,
			page: 0,
			expectedDeliveryDate: {
				greaterThanOrEqual: start
					? dayjs(start).toISOString()
					: undefined,
				lessThanOrEqual: end
					? dayjs(end).add(1, "day").toISOString()
					: undefined,
			},
		}));
	};

	const handleSearch = (value: string) => {
		setQuery({ ...query, text_search: value });
	};
	const onChangeDate = (date: Dayjs, dateString: string | string[]) => {
		setQuery((pre) => ({
			...pre,
			date: date.add(7, "hour").toISOString(),
		}));
	};
	return (
		<Space direction="vertical" className="flex ">
			<Space className="flex-wrap items-end">
				<Button
					icon={<RotateCcw size={18} />}
					onClick={() => refresh()}
				>
					Làm mới
				</Button>
				<InputSearchCustom
					value={query.date}
					handleSearch={handleSearch}
					placeholder="Tên nhân viên"
				/>
				<SelectStatusForm
					onChange={onChangeStaus}
					defaultValue={TStatus.IN_PROCESS}
					ignoreStatus={[
						TStatus.DELIVERED,
						TStatus.CANCEL,
						TStatus.NEW,
					]}
				/>

				<DatePicker
					defaultValue={dayjs()}
					onChange={onChangeDate}
					placeholder="Thời gian"
					allowClear={false}
					format={KEY_CONST.DATE_FORMAT}
				/>
			</Space>
			<Table
				columns={columns}
				dataSource={schedule}
				rowKey="id"
				pagination={pagination}
				// onChange={handleTableChange}
				scroll={{
					x: 1200,
					y: 350,
					scrollToFirstRowOnChange: true,
				}}
				loading={isLoadingSchedule}
			/>
		</Space>
	);
};

export default ScheduleList;
