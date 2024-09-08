"use client";
import React, { useState } from "react";
import { Radio, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

type ColumnsType<T extends object> = TableProps<T>["columns"];
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const topOptions = [
  { label: "topLeft", value: "topLeft" },
  { label: "topCenter", value: "topCenter" },
  { label: "topRight", value: "topRight" },
  { label: "none", value: "none" },
];

const bottomOptions = [
  { label: "bottomLeft", value: "bottomLeft" },
  { label: "bottomCenter", value: "bottomCenter" },
  { label: "bottomRight", value: "bottomRight" },
  { label: "none", value: "none" },
];

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (tags: string[]) => (
      <span>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={{ position: ["bottomRight"] }}
        dataSource={data}
      />
    </div>
  );
};

export default App;
