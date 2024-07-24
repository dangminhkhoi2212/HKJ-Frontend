"use client";
import React from "react";
import { Divider, Layout, Menu, MenuProps } from "antd";
import Logo from "../Logo";
import {
  LayoutDashboard,
  LineChart,
  MessageCircle,
  PackageSearch,
  Truck,
} from "lucide-react";
import TrackProductCard from "@/shares/Sidebar/TrackProductCard";
import useStyleStore from "@/stores/stype";

const { Sider, Header } = Layout;
const menuItems: MenuProps["items"] = [
  {
    key: "1",
    icon: <LayoutDashboard size={18} />,
    label: "Trang chủ",
  },
  {
    key: "2",
    icon: <LineChart size={18} />,
    label: "Giá vàng",
  },
  {
    key: "3",
    icon: <PackageSearch size={18} />,
    label: "Mẫu có sẵn",
  },
  {
    key: "4",
    icon: <Truck size={18} />,
    label: "Đơn hàng",
  },
  {
    key: "5",
    icon: <MessageCircle size={18} />,
    label: "Nhắn tin",
  },
];
const Sidebar: React.FC = () => {
  const collapsed: boolean = useStyleStore((state) => state.collapsed);
  return (
    <Sider trigger={null} collapsible theme="light" collapsed={collapsed}>
      <div className="flex justify-center items-center h-[64px]">
        <Logo />
      </div>
      <Divider />
      <Menu
        theme="light"
        mode="inline"
        className=""
        defaultSelectedKeys={["1"]}
        items={menuItems}
      />
      <Divider />
      <TrackProductCard />
    </Sider>
  );
};
export default Sidebar;
