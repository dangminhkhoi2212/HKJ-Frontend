"use client";
import { Button, Dropdown, Space, Table, TableProps, Tag } from "antd";
import { MenuProps } from "antd/lib";
import { Menu as MenuIcon, RotateCcw } from "lucide-react";
import React, { useState } from "react";

import { QUERY_CONST } from "@/const";
import { userService } from "@/services";
import { TAccontQuery, TEmployee, TQuery } from "@/types";
import { useQuery } from "@tanstack/react-query";

const EmployeeList: React.FC<{}> = () => {
	const [query, setQuery] = useState<TQuery<TAccontQuery>>(
		QUERY_CONST.defaultQuery
	);
	const {
		data: employees,
		refetch,
		isPending,
	} = useQuery({
		queryKey: ["employees", query],
		queryFn: () => userService.getUsersByRole(query),
	});

	const items: MenuProps["items"] = [
		{
			label: "Tạo dự án mới",
			key: "0",
			onClick: () => {
				console.log("click");
			},
		},
		{
			label: "Thêm vào dự án",
			key: "1",
		},
	];
	const columns: TableProps<TEmployee>["columns"] = [
		{
			title: "Họ",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Tên",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Số điện thoại",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Đã kích hoạt",
			dataIndex: "activated",
			key: "activated",
			render: (value: boolean) =>
				value ? (
					<Tag color="green">Đã kích hoạt</Tag>
				) : (
					<Tag color="red">Chưa kích hoạt</Tag>
				),
		},
		{
			title: "Tùy chọn",
			dataIndex: "actions",
			key: "actions",
			render: () => (
				<Dropdown menu={{ items }} trigger={["click"]} arrow>
					<Button icon={<MenuIcon />}></Button>
				</Dropdown>
			),
		},
	];

	// const handleOnchange = (text: string) => {
	// 	setQuery({
	// 		...query,
	// 		name: {
	// 			contains: text,
	// 		},
	// 	});
	// };
	return (
		<Space direction="vertical" className="flex">
			<Space>
				<Button
					onClick={() => refetch()}
					icon={<RotateCcw size={18} />}
				>
					Làm mới
				</Button>
				{/* <InputSearchCustom
					placeholder="Tìm kiếm nhan viên"
					handleSearch={(value) => handleOnchange(value)}
				/> */}
			</Space>
			<Table
				columns={columns}
				dataSource={employees}
				rowKey="id"
				loading={isPending}
			/>
		</Space>
	);
};

export default EmployeeList;
