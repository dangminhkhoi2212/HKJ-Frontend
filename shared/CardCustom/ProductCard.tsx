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
				className="flex flex-col justify-between items-center overflow-hidden h-[350px] w-full" // Ensure spacing between elements
				cover={
					<div className="size-56 relative overflow-hidden">
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
				<div className="flex flex-col justify-between flex-grow w-full gap-4">
					<p className="font-semibold line-clamp-2 text-center">
						{jewelry.name}
					</p>
					<div className="mt-auto flex justify-center">
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
