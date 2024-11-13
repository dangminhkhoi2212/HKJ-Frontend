import { Card, Image, Skeleton, Tag } from "antd";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { TJewelry } from "@/types";
import { formatUtil } from "@/utils";

type Props = { jewelry?: TJewelry };
const { formatCurrency } = formatUtil;
const OrderProductCard: React.FC<Props> = ({ jewelry }) => {
	if (!jewelry?.id) return <></>;
	return (
		<Card
			className="flex  justify-stretch items-center overflow-hidden w-full max-w-80  " // Set a fixed height for the card
			cover={
				<div className="size-20 overflow-hidden  m-4 rounded-md">
					<Image
						alt={jewelry.name}
						src={jewelry.coverImage}
						preview={true}
						sizes="80px"
						placeholder={
							<Skeleton.Image
								active={true}
								className="w-full h-full"
							/>
						}
						className="h-full" // Ensure the image covers the space without stretching
					/>
				</div>
			}
		>
			<div className="flex justify-around items-center flex-col gap-4">
				<Link href={routesUser.productDetail(jewelry.id)}>
					<p className="font-semibold line-clamp-2 text-gray-700">
						{jewelry.name}
					</p>
				</Link>
				<div className=" flex justify-center">
					<Tag
						color="red"
						bordered={false}
						className="flex justify-center"
					>
						{formatCurrency(jewelry.price)}
					</Tag>
				</div>
			</div>
		</Card>
	);
};

export default OrderProductCard;
