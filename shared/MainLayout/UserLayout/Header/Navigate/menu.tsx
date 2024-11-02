import { MenuProps } from 'antd';
import { House, LayoutDashboard, ListOrdered, Truck } from 'lucide-react';

import { routesUser } from '@/routes';

type MenuItem = Required<MenuProps>["items"][number];
export const menuUser: MenuItem[] = [
	{
		key: routesUser.home,
		icon: <House size={18} />,

		label: "Trang chủ",
	},
	{
		key: routesUser.product,
		icon: <LayoutDashboard size={18} />,
		label: "Sản phẩm",
	},

	{
		key: routesUser.order,
		icon: <Truck size={18} />,
		label: "Đơn hàng",
	},
	{
		key: routesUser.createOrder(),
		icon: <ListOrdered size={18} />,
		label: "Đặt hàng",
	},
];
