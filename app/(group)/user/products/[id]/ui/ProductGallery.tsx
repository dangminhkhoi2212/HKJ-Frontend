import { Image } from "antd";
import React from "react";

import { productDetailStore } from "../store";

type Props = {};

const ProductGallery: React.FC<Props> = ({}) => {
	const jewelry = productDetailStore((state) => state.jewelry);

	return (
		<div className="rounded-2xl overflow-hidden flex flex-col justify-center items-center p-4">
			<Image
				src={jewelry?.coverImage}
				alt={jewelry?.name}
				className="rounded-2xl max-h-96 max-w-96 object-fill h-full w-full"
			/>
		</div>
	);
};

export default ProductGallery;
