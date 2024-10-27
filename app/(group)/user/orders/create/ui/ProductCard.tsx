import { Tag } from "antd";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { jewelryService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { useQuery } from "@tanstack/react-query";

import ProductCard from "../../../products/ui/ProductCard";

type Props = {};

const ProductCardOrder: React.FC<Props> = ({}) => {
	const { searchParams } = useRouterCustom();
	const pId = searchParams.get("pId");
	const getProduct = useQuery({
		queryKey: ["product", pId],
		queryFn: () => jewelryService.getOne(pId!),
		enabled: !!pId,
	});
	if (!pId || !getProduct.data) return <></>;
	return (
		<div className="">
			<div className="inline-flex flex-col gap-2">
				<LabelCustom label="Sản phẩm mẫu" />
				<Tag color="blue">
					Sản phẩm bạn đặt làm sẽ dựa trên sản phẩm mẫu này
				</Tag>

				<ProductCard jewelry={getProduct?.data!} />
			</div>
		</div>
	);
};

export default ProductCardOrder;
