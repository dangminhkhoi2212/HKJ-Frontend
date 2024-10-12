import { MenuProps } from "antd";
import {
	Atom,
	FolderClosed,
	Gem,
	LayoutDashboard,
	LineChart,
	ListOrdered,
	MessageCircle,
	Notebook,
	NotepadTextDashed,
	PackageSearch,
	SquareUser,
	Truck,
	User,
	UserCog,
	Users,
} from "lucide-react";

import { routesAdmin, routesManager } from "@/routes";

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
		key: routesManager.project,
		icon: <FolderClosed size={18} />,
		label: "Dự án",
	},
	{
		key: routesManager.jewelry,
		icon: <Gem size={18} />,
		label: "Trang sức",
	},
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
	{
		key: routesManager.material,
		icon: <Atom size={18} />,
		label: "Chất liệu",
	},
	{
		key: routesManager.category,
		icon: <Notebook size={18} />,
		label: "Loại trang sức",
	},
	{
		key: routesManager.template,
		icon: <NotepadTextDashed size={18} />,
		label: "Bản mẫu dự án",
	},
];
export const menuAdmin: MenuProps["items"] = [
	{
		key: routesAdmin.accounts,
		icon: <Users size={18} />,
		label: "Quản lí tài khoản",
	},
	{
		key: routesAdmin.positions,
		icon: <SquareUser size={18} />,
		label: "Vị trí nhân viên",
	},
	{
		key: routesAdmin.hire,
		icon: <UserCog size={18} />,
		label: "Thuê nhân viên",
	},
];
