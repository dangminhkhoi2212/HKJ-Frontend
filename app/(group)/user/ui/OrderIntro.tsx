import { Button, Card } from "antd";
import { ArrowBigRightDash, Gem, Package, Pickaxe, Store } from "lucide-react";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { Frame } from "@/shared/Frame";

type Props = {};

const items = [
	{
		title: "Lựa chọn trang sức yêu thích",
		icon: <Gem />,
		content:
			"Hãy bắt đầu bằng cách chọn một món trang sức có sẵn tại cửa hàng hoặc gửi yêu cầu thiết kế riêng theo ý tưởng của bạn.",
	},
	{
		title: "Xác nhận đơn hàng",
		icon: <Store />,
		content:
			"Sau khi bạn đặt hàng, cửa hàng sẽ nhanh chóng xác nhận thông tin để đảm bảo mọi chi tiết đều chính xác.",
	},
	{
		title: "Chế tác trang sức tinh xảo",
		icon: <Pickaxe />,
		content:
			"Đội ngũ nghệ nhân giàu kinh nghiệm sẽ bắt tay vào chế tác, biến những ý tưởng và thiết kế thành hiện thực.",
	},
	{
		title: "Giao hàng tận tay",
		icon: <Package />,
		content:
			"Món trang sức được hoàn thiện sẽ được giao tận tay bạn, mang đến trải nghiệm hài lòng trọn vẹn.",
	},
];
const OrderIntro: React.FC<Props> = ({}) => {
	return (
		<Frame title="Đặt thiết kế trang sức một cách dễ dàng">
			<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{items.map((item, index) => (
					<Card
						key={index}
						className="col flex flex-col justify-start items-center gap-6"
					>
						<div className="p-5 rounded-full bg-primary-950  text-center font-semibold text-xl flex justify-center items-center">
							{item.icon}
						</div>
						<p className="text-2xl font-semibold">{item.title}</p>
						<p className="italic text-lg font-light">
							{item.content}
						</p>
					</Card>
				))}
			</div>
			<div className="flex justify-center items-center gap-4 mt-4">
				<Link href={routesUser.createOrder}>
					<Button
						type="primary"
						icon={<ArrowBigRightDash />}
						iconPosition="end"
						size="large"
					>
						Đặt hàng với thiết kế riêng
					</Button>
				</Link>
				<Link href={routesUser.product}>
					<Button
						type="primary"
						size="large"
						icon={<ArrowBigRightDash />}
						iconPosition="end"
					>
						Đặt hàng với mẫu có sẵn
					</Button>
				</Link>
			</div>
		</Frame>
	);
};

export default OrderIntro;
