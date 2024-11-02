import { Card, Image, Skeleton, Tag } from 'antd';
import React from 'react';

import { TJewelry } from '@/types';
import { formatUtil } from '@/utils';

type Props = { jewelry: TJewelry };
const { formatCurrency } = formatUtil;
const OrderProductCard: React.FC<Props> = ({ jewelry }) => {
	if (!jewelry?.id) return <></>;
	return (
		<Card
			className="flex  justify-stretch items-center overflow-hidden w-full max-w-80" // Set a fixed height for the card
			cover={
				<div className="size-20 overflow-hidden">
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
	);
};

export default OrderProductCard;
