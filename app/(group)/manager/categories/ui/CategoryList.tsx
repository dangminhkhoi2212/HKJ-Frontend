"use client";
import { Button, Space, Table, TableProps } from "antd";
import { Pencil, Trash } from "lucide-react";
import React from "react";

import { TCategory } from "@/types";
import { formatUtil } from "@/utils";

import categoryStore from "../store";

type TProps = {
  data: TCategory[];
  loading?: boolean;
};
const CategoryList: React.FC<TProps> = ({ data, loading }) => {
  const {
    setCategoryUpdate,
    setOpenDrawer,
    setCategoryDelete,
    pagination,
    setQuery,
    query,
    setPagination,
  } = categoryStore();
  const handleTableChange: TableProps<TCategory>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setQuery({
      ...query,
      page: pagination.current! - 1,
    });
    setPagination(pagination);
  };
  const columns: TableProps<TCategory>["columns"] = [
    {
      title: "Tên loại",
      dataIndex: "name",
      key: "name",
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
      render(value, record, index) {
        return formatUtil.formatDate(value);
      },
    },
    {
      title: "Ngày chỉnh sửa",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render(value, record, index) {
        return formatUtil.formatDate(value);
      },
    },
    {
      title: "Tùy chọn",
      dataIndex: "actions",
      key: "actions",

      render: (value, record, index) => (
        <Space>
          <Button
            icon={<Pencil size={18} />}
            onClick={() => {
              setCategoryUpdate(record);
              setOpenDrawer(true);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<Trash size={18} />}
            onClick={() => setCategoryDelete(record)}
          />
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        className="min-h-80"
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CategoryList;
