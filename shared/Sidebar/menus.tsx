import { routesManager, routesUser } from "@/routes";
import { MenuProps } from "antd";

import {
  LayoutDashboard,
  LineChart,
  ListOrdered,
  MessageCircle,
  PackageSearch,
  Truck,
  User,
} from "lucide-react";
export const menuUser: MenuProps["items"] = [
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
export const menuEmployee: MenuProps["items"] = [
  {
    key: "1",
    icon: <MessageCircle size={18} />,
    label: "Công việc hôm nay",
  },
];
export const menuManager: MenuProps["items"] = [
  {
    key: routesManager.employees,
    icon: <User size={18} />,
    label: "Nhân viên",
  },
  {
    key: routesManager.order,
    icon: <ListOrdered size={18} />,
    label: "Đơn đặt hàng",
  },
];
