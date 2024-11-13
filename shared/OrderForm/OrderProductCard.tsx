import { Tag } from "antd";
import React from "react";

import { ProductCard } from "@/shared/CardCustom";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { TJewelry } from "@/types";

type Props = {
	product: TJewelry;
};

const OrderProductCard: React.FC<Props> = ({ product }) => {
	if (!product) return <></>;
	return (
		<div className="">
			<div className="inline-flex flex-col gap-2">
				<LabelCustom label="Sản phẩm mẫu" />
				<Tag color="blue">
					Sản phẩm bạn đặt làm sẽ dựa trên sản phẩm mẫu này
				</Tag>

				<ProductCard jewelry={product} />
			</div>
		</div>
	);
};

export default OrderProductCard;
