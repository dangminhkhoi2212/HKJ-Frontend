import { Card, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { TJewelry } from "@/types";
import { formatUtil } from "@/utils";

type Props = { jewelry: TJewelry };
const { formatCurrency } = formatUtil;
const { Meta } = Card;
const ProductCard: React.FC<Props> = ({ jewelry }) => {
	return (
		<Link href={routesUser.productDetail(jewelry.id)}>
			<Card
				className="flex flex-col justify-stretch items-center overflow-hidden h-72 max-w-60" // Set a fixed height for the card
				cover={
					<div className="size-40 relative  overflow-hidden">
						<Image
							alt={jewelry.name}
							src={jewelry.coverImage}
							sizes="150px"
							fill
							className="absolute object-cover" // Ensure the image covers the space without stretching
						/>
					</div>
				}
			>
				<div className="flex justify-around items-center flex-col gap-4">
					<p className="font-semibold line-clamp-2">{jewelry.name}</p>
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
		</Link>
	);
};

export default ProductCard;
