"use client";
import React from "react";
import { Button, Dropdown, Space, Table, TableProps, Tag, Tooltip } from "antd";
import { RotateCcw, Menu as MenuIcon } from "lucide-react";
import { TEmployees, useEmployeesAction } from "./action";
import { MenuProps } from "antd/lib";

const EmployeesPage: React.FC = () => {
  const { data, isLoading, selectedRowKeys, onSelectChange, refreshEmployees } =
    useEmployeesAction();
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
  const columns: TableProps<TEmployees>["columns"] = [
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
    <div className="flex flex-col gap-3 justify-items-start">
      <Tooltip title="Làm mới">
        <Button onClick={() => refreshEmployees()} icon={<RotateCcw />} />
      </Tooltip>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default EmployeesPage;
