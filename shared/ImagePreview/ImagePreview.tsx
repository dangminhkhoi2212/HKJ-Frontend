"use client";
import "../../shared/ImagePreview/ImagePreview.css";

import { Empty, Image, Space } from "antd";
import React, { useEffect } from "react";

import { cn } from "@/utils";
import {
	LeftOutlined,
	RightOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	SwapOutlined,
	UndoOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
} from "@ant-design/icons";

type TProps = {
	images?: string[];
	className?: string;
	width?: number;
	height?: number;
};
const ImagePreview: React.FC<TProps> = ({
	images,
	width = 100,
	height = 100,
	className,
}) => {
	const [current, setCurrent] = React.useState(0);
	const [imageList, setImageList] = React.useState<string[]>([]);
	useEffect(() => {
		if (images?.length) {
			setImageList(images);
		}
	}, [images]);
	if (!images || !images.length)
		return (
			<div className="flex justify-center items-center w-full">
				<Empty />
			</div>
		);
	return (
		<Image.PreviewGroup
			preview={{
				toolbarRender: (
					_,
					{
						transform: { scale },
						actions: {
							onActive,
							onFlipY,
							onFlipX,
							onRotateLeft,
							onRotateRight,
							onZoomOut,
							onZoomIn,
							onReset,
						},
					}
				) => (
					<Space size={12} className="toolbar-wrapper">
						<LeftOutlined
							onClick={() => onActive?.(-1)}
							size={34}
						/>
						<RightOutlined
							onClick={() => onActive?.(1)}
							size={34}
						/>
						{/* <DownloadOutlined onClick={onDownload} size={34} /> */}
						<SwapOutlined rotate={90} onClick={onFlipY} size={34} />
						<SwapOutlined onClick={onFlipX} size={34} />
						<RotateLeftOutlined onClick={onRotateLeft} size={34} />
						<RotateRightOutlined
							onClick={onRotateRight}
							size={34}
						/>
						<ZoomOutOutlined
							disabled={scale === 1}
							onClick={onZoomOut}
							size={34}
						/>
						<ZoomInOutlined
							disabled={scale === 50}
							onClick={onZoomIn}
							size={34}
						/>
						<UndoOutlined onClick={onReset} />
					</Space>
				),
				onChange: (index) => {
					setCurrent(index);
				},
			}}
		>
			<div className={cn(className)}>
				{imageList?.map((item, index) => {
					return (
						<Image
							key={index}
							src={item}
							width={width}
							height={height}
							alt={item}
							className="rounded"
						/>
					);
				})}
			</div>
		</Image.PreviewGroup>
	);
};

export default ImagePreview;
