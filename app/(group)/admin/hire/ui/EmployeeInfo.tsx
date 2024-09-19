import type { DescriptionsProps } from "antd";
import { Descriptions } from "antd";
import React from "react";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Họ",
    children: "Cloud",
    span: 1,
  },
  {
    key: "2",
    label: "Tên",
    children: "Prepaid",
    span: 1,
  },
  {
    key: "3",
    label: "Email",
    children: "YES",
    span: 1,
  },
  {
    key: "4",
    label: "Số điện thoại",
    children: "2018-04-24 18:00:00",
    span: 1,
  },
  {
    key: "5",
    label: "Ngày tạo tài khoản",
    children: "2019-04-24 18:00:00",
    span: 2,
  },

  {
    key: "10",
    label: "Địa chỉ",
    children: <>sdf</>,
    span: 2,
  },
];

const EmployeeInfo: React.FC = () => (
  <Descriptions
    layout="vertical"
    bordered
    items={items}
    column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
  />
);

export default EmployeeInfo;
