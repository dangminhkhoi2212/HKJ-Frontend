"use client";
import { Skeleton, Space } from "antd";
import React from "react";

import { jewelryImageService } from "@/services";
import { ImagePreview } from "@/shared/ImagePreview";
import { useQuery } from "@tanstack/react-query";

import { productDetailStore } from "../store";

type Props = {};

const ProductImages: React.FC<Props> = ({}) => {
	const jewelry = productDetailStore((state) => state.jewelry);
	const getImages = useQuery({
		queryKey: ["images", { jewelryModelId: { equals: jewelry?.id } }],
		queryFn: () =>
			jewelryImageService.get({
				jewelryModelId: { equals: jewelry?.id },
				isDeleted: { equals: false },
			}),
		enabled: !!jewelry?.id,
	});
	if (getImages.isLoading)
		return (
			<Space>
				{Array.from({ length: 6 }).map((item, index) => (
					<Skeleton.Image key={index} active={true} />
				))}
			</Space>
		);
	if (getImages.data?.length === 0) return <p>Không có hình ảnh</p>;
	return (
		<div className="flex overflow-auto">
			<ImagePreview
				className="flex gap-2 flex-nowrap"
				width={80}
				height={80}
				images={getImages?.data?.map((image) => image.url)!}
			/>
		</div>
	);
};

export default ProductImages;
