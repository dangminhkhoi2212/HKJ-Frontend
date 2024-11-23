import { Button, message, Tag, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Image } from "lucide-react";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { imageSearchAIStore } from "@/stores";

const ImageSearchButton: React.FC = () => {
	const { router } = useRouterCustom();
	const setFile = imageSearchAIStore((state) => state.setFile);

	const handleChange = (file: File) => {
		console.log("🚀 ~ file:", file);
		if (file) {
			setFile(file); // Set the file in Zustand store
			router.push(routesUser.product); // Redirect to desired route
		}
	};

	const beforeUpload = (file: File) => {
		// Check if file is an allowed image type
		const isJpgOrPng =
			file.type === "image/png" ||
			file.type === "image/jpeg" ||
			file.type === "image/jpg";
		if (!isJpgOrPng) {
			message.error("Chỉ chấp nhận các tệp PNG, JPG, hoặc JPEG!");
			return Upload.LIST_IGNORE;
		}
		handleChange(file);
		return false; // Prevent auto upload by returning false
	};

	return (
		<div>
			<ImgCrop
				modalTitle="Tìm kiếm hình ảnh"
				modalProps={{
					footer(originNode, extra) {
						return (
							<div className="flex flex-col justify-end gap-4">
								<div>
									<Tag color="yellow">
										Hãy chọn rõ chi tiết để nâng cao độ
										chính xác khi tìm kiếm
									</Tag>
								</div>
								<div className="flex justify-end gap-4">
									{originNode}
								</div>
							</div>
						);
					},
				}}
				modalOk="Tìm kiếm"
				modalCancel="Hủy"
				rotationSlider
				zoomSlider
				showReset
				maxZoom={10}
			>
				<Upload beforeUpload={beforeUpload} showUploadList={false}>
					<Button icon={<Image size={14} />}></Button>
				</Upload>
			</ImgCrop>
		</div>
	);
};

export default ImageSearchButton;
