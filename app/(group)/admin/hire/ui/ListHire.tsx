import { Button, Modal, Select, Table, TablePaginationConfig } from "antd";
import { SearchProps } from "antd/es/input";
import { TableProps } from "antd/lib";
import cleanDeep from "clean-deep";
import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { hireService } from "@/services";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TQuery } from "@/types";
import { THire, THireQuery } from "@/types/hireType";
import { formatUtil, sortUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

import HireDisplay from "./HireDisplay";

type TSelectHire = {
	show: boolean;
	record?: THire;
};
const ListHire: React.FC<{}> = () => {
	const [query, setQuery] = useState<TQuery<THireQuery>>(
		QUERY_CONST.defaultQuery
	);

	const [data, setData] = useState<THire[]>([]);

	const { updatePathname, router, pathname } = useRouterCustom();

	const [inputSearchType, setInputSearchType] = useState<
		"position" | "employee"
	>("employee");

	const [pagination, setPagination] = useState<TablePaginationConfig>(
		QUERY_CONST.initPagination
	);

	const [selectHire, setSelectHire] = useState<TSelectHire>({ show: false });
	const [getHires, getHiresCount] = useQueries({
		queries: [
			{
				queryKey: ["hires", query], // Pass the query state as part of the key
				queryFn: () => hireService.get(query),
			},
			{
				queryKey: ["hires-count", query], // Use the same query object for count
				queryFn: () => hireService.getCount(query),
			},
		],
	});

	if (getHires.isSuccess) {
		setData(getHires.data as THire[]);
	}
	if (getHiresCount.isSuccess) {
		setPagination({ ...pagination, total: getHiresCount.data as number });
	}
	const columns: TableProps<THire>["columns"] = [
		{
			title: "Họ Tên",
			dataIndex: "employee",
			key: "name",
			sorter: (a, b) =>
				sortUtil.sortName(
					a.employee.user.first_name[0],
					b.employee.user.first_name[0]
				),
			render(value, record, index) {
				return (
					<div>
						{value.user.first_name + " " + value?.user.last_name}
					</div>
				);
			},
		},
		{
			title: "Vị trí",
			dataIndex: "position",
			key: "postion",
			render(value, record, index) {
				return <div>{value?.name}</div>;
			},
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "beginDate",
			key: "beginDate",
			sorter: (a, b) => sortUtil.sortDate(a.beginDate, b.beginDate),
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
			dataIndex: "endDate",
			key: "endDate",
			sorter: (a, b) => sortUtil.sortDate(a.endDate, b.endDate),
			render(value, record, index) {
				return (
					<div>
						{formatUtil.formatDate(value, { removeTime: true })}
					</div>
				);
			},
		},
		{
			title: "Mức lương",
			dataIndex: "beginSalary",
			key: "beginSalary",
			sorter: (a, b) => a.beginSalary - b.beginSalary,

			render(value, record, index) {
				return (
					<p className="text-right p-0 m-0">
						{formatUtil.formatCurrency(value)}
					</p>
				);
			},
		},
		{
			title: "Thao tác",
			dataIndex: "action",
			key: "action",

			render(value, record, index) {
				return (
					<Button
						onClick={() => setSelectHire({ show: true, record })}
						icon={<Eye size={18} />}
					></Button>
				);
			},
		},
	];
	const handleTableChange: TableProps<THire>["onChange"] = (pagination) => {
		setQuery(
			(pre) =>
				({
					...(pre as object),
					page: pagination.current! - 1,
				}) as TQuery<null>
		);
	};
	const handleSearch: SearchProps["onSearch"] = (value) => {
		console.log("🚀 ~ handleSearch ~ value:", value);
		const newQuery: TQuery<THireQuery> = { ...QUERY_CONST.defaultQuery };
		if (!value || value === "") {
			refresh();
			return;
		}
		if (inputSearchType === "employee") {
			newQuery.employeeName = {};
			newQuery.employeeName.equals = value;
		}
		if (inputSearchType === "position") {
			newQuery.positionName = {};
			newQuery.positionName.contains = value;
		}

		setQuery(cleanDeep(newQuery));
	};
	const refresh = () => {
		getHires.refetch();
		getHiresCount.refetch();
		setQuery({ ...QUERY_CONST.defaultQuery });
	};

	useEffect(() => {
		refresh();
	}, []);
	const optionsSearch = [
		{
			value: "employee",
			label: "Tên nhân viên",
		},
		{
			value: "position",
			label: "Tên vị trí",
		},
	];
	return (
		<div className="flex flex-col gap-4">
			<Modal
				title="Thông tin thuê nhân viên"
				closable
				open={selectHire.show}
				footer={[
					<Button
						key={useId()}
						onClick={() => setSelectHire({ show: false })}
					>
						Đóng
					</Button>,
				]}
				onCancel={() => setSelectHire({ show: false })}
			>
				<HireDisplay data={selectHire.record!} />
			</Modal>
			<div className="flex justify-start items-center gap-4">
				<Button
					onClick={() => {
						refresh();
					}}
					icon={<RotateCcw size={18} />}
				>
					Làm mới
				</Button>
				<InputSearchCustom
					handleSearch={handleSearch}
					placeholder="Tên nhân viên, tên vị trí"
					className="w-80"
					addonBefore={
						<Select
							defaultValue={inputSearchType}
							options={optionsSearch}
							showAction={["focus"]}
							size="small"
							className="w-fit"
							onChange={(value) => {
								setInputSearchType(value);
							}}
						/>
					}
				/>
			</div>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="id"
				loading={{
					style: {},
					className: "absolute inset-0",
					spinning: getHires.isFetching,
				}}
				pagination={pagination}
				onChange={handleTableChange}
			/>
		</div>
	);
};

export default ListHire;
