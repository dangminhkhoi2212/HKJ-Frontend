import React from "react";

import { Frame } from "@/shared/Frame";

import { productDetailStore } from "../store";

type Props = {};

const ProductDescription: React.FC<Props> = ({}) => {
	const jewelry = productDetailStore((state) => state.jewelry);
	return (
		<Frame title="Mô tả">
			<div
				dangerouslySetInnerHTML={{
					__html: jewelry?.description ?? "Không có mô tả",
				}}
			/>
		</Frame>
	);
};

export default ProductDescription;
