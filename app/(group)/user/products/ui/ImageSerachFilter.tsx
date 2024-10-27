"use client";
import { Image } from "antd";
import React, { useEffect, useState } from "react";

import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { imageSearchAIStore } from "@/stores";

type Props = {};

const ImageSearchFilter: React.FC<Props> = ({}) => {
	const image = imageSearchAIStore((state) => state.file);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		if (image === null) return;
		const url = URL.createObjectURL(image);
		setImageUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [image]);
	if (!imageUrl) return <></>;
	return (
		<div>
			<LabelCustom label="Hình ảnh tìm kiếm" />
			<Image src={imageUrl} width={100} height={100} />
		</div>
	);
};

export default ImageSearchFilter;
