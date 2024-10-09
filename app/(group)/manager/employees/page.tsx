"use client";
import { Button, Dropdown, Space, Table, TableProps, Tag } from "antd";
import { MenuProps } from "antd/lib";
import { Menu as MenuIcon, RotateCcw } from "lucide-react";
import React from "react";

import { TEmployee } from "@/types";

import { useEmployeesAction } from "./action";

const EmployeesPage: React.FC<{}> = () => {
	const {
		data,
		isLoading,
		selectedRowKeys,
		onSelectChange,
		refreshEmployees,
	} = useEmployeesAction();
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

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	return (
		<Space direction="vertical" className="flex">
			<div>
				<Button
					onClick={() => refreshEmployees()}
					icon={<RotateCcw size={18} />}
				>
					Làm mới
				</Button>
			</div>
			<Table
				columns={columns}
				rowSelection={rowSelection}
				dataSource={data}
				rowKey="id"
				loading={isLoading}
			/>
		</Space>
	);
};

export default EmployeesPage;
