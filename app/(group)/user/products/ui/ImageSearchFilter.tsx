"use client";
import { Button, Card, Image } from "antd";
import { Trash } from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";

import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { ImageSearchButton } from "@/shared/ImageSearchButton";
import { imageSearchAIStore } from "@/stores";

type Props = {};

const ImageSearchFilter: React.FC<Props> = ({}) => {
	const image = imageSearchAIStore((state) => state.file);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const setFile = imageSearchAIStore((state) => state.setFile);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		if (image === null) return;
		const url = URL.createObjectURL(image);
		setImageUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [image]);
	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setFile(file);
	};
	const handleClear = () => {
		setFile(null);
	};
	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click(); // Programmatically click the hidden file input
		}
	};
	if (!imageUrl) return <></>;
	return (
		<Card>
			<div className="flex flex-col gap-4 justify-center items-center">
				<LabelCustom label="Hình ảnh tìm kiếm" />
				<Image
					src={imageUrl}
					width={60}
					height={60}
					className="ring rounded-md"
				/>
				<div className="flex justify-center gap-2">
					<Button
						size="middle"
						icon={<Trash size={14} />}
						onClick={handleClear}
					></Button>
					<ImageSearchButton />
				</div>
			</div>
		</Card>
	);
};

export default memo(ImageSearchFilter);
