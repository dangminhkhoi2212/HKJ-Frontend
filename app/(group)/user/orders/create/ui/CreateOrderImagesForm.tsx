"use client";
import { App, Button, Space, Spin, Tag, UploadFile } from "antd";
import React, { useState } from "react";

import { orderImageService } from "@/services";
import supabaseService from "@/services/supabaseService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import { TOrderImageCreate } from "@/types";
import { useMutation } from "@tanstack/react-query";

import { createOrderStore } from "../store";

type Props = {};

const CreateOrderImagesForm: React.FC<Props> = ({}) => {
	const order = createOrderStore((state) => state.order);
	const [images, setImages] = useState<UploadFile[] | null>(null);
	console.log("🚀 ~ images:", images);
	const message = App.useApp().message;
	const next = createOrderStore((state) => state.next);
	const handleOnChange = (
		newFileList: UploadFile[],
		file: UploadFile<any>
	) => {
		setImages(newFileList);
	};
	const uploadImages = async (): Promise<string[] | null> => {
		if (images && images.length > 0) {
			const folder = supabaseService.createImagesFolder(
				"orders",
				order?.id!
			);
			return await supabaseService.uploadMultiple(images, folder);
		}
		return null;
	};
	const createOrerImages = async () => {
		const urls = await uploadImages();
		if (urls) {
			const data: TOrderImageCreate[] = urls.map((url) => ({
				url: url,
				order: { id: order?.id! },
			}));
			await orderImageService.createMultiple(data);
		}
	};
	const createMutation = useMutation({
		mutationFn: () => createOrerImages(),
		onSuccess: () => {
			message.success("Đã cung cấp thêm hình ảnh");
		},
	});
	const handleCreate = async () => {
		if (images) {
			await createMutation.mutateAsync();
		}
		next();
	};
	return (
		<Spin spinning={createMutation.isPending}>
			<Space direction="vertical" className="flex">
				<LabelCustom label="Cung cấp thêm hình ảnh" />
				<Tag className="text-wrap italic">
					Hình ảnh này giúp chúng tôi có thể tạo ra sản phẩm giống ý
					bạn hơn
				</Tag>
				<InputImage onChange={handleOnChange} />
				<div className="flex justify-end">
					<Button type="primary" onClick={() => handleCreate()}>
						Hoàn thành
					</Button>
				</div>
			</Space>
		</Spin>
	);
};

export default CreateOrderImagesForm;
