import { Card, Image, Skeleton, Tag } from "antd";
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
				className="flex flex-col justify-stretch overflow-hidden h-72 max-w-60" // Set a fixed height for the card
				cover={
					<div className="h-40 max-h-40 overflow-hidden">
						<Image
							alt={jewelry.name}
							src={jewelry.coverImage}
							preview={false}
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
