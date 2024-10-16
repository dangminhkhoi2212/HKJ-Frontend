import { Image, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadFileStatus } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";

import { imageService } from "@/services";
import { TImageResponse } from "@/services/imageService";
import supabseService from "@/services/supabaseService";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";

import type { GetProp, UploadFile, UploadProps } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export type UploadRequestOption<T = any> = Parameters<
	Exclude<UploadProps<T>["customRequest"], undefined>
>[0];
type TProps = {
	images?: UploadFile[];
	maxCount?: number;
	minCount?: number;
	errorMessage?: string;
	onChange?: (newFileList: UploadFile[], file: UploadFile<any>) => void;
	onRemove?: (file: UploadFile<any>) => void;
};
const getBase64 = (file: FileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const InputImages: React.FC<TProps> = ({
	images = [],
	onChange,
	onRemove,
	errorMessage,
	maxCount = 8,
	minCount = 1,
}) => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	useEffect(() => {
		if (images && images.length > 0) setFileList([...images]);
	}, [images]);
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			try {
				file.preview = await getBase64(file.originFileObj as FileType);
			} catch (error) {
				console.error("Error occurred while generating base64:", error);
			}
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleChange: UploadProps["onChange"] = ({
		fileList: newFileList,
		file,
		event,
	}) => {
		setFileList(newFileList);
		if (onChange) onChange(newFileList, file);
	};
	const updateFileStatus = (file: UploadFile, status: UploadFileStatus) => {
		setFileList((pre) => [
			...pre.map((f) => (f.uid === file.uid ? { ...f, status } : f)),
		]);
	};
	const handleOnRemove: UploadProps["onRemove"] = async (file) => {
		try {
			const listImage: string[] = [file.url!];
			updateFileStatus(file, "uploading");

			const response = await imageService.deleteImages(listImage);
			if (response.success) {
				if (onRemove) onRemove(file);
				updateFileStatus(file, "removed");
			} else {
				updateFileStatus(file, "done");
			}
		} catch (error) {
			console.error("Error occurred while deleting images:", error);
			updateFileStatus(file, "error");
		}
	};

	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</button>
	);

	const updaloadImageMutation = useMutation({
		mutationFn: (file: File) => supabseService.uploadFile(file, ""),
	});
	const customRequest = async (options: UploadRequestOption) => {
		const { onSuccess, onError, file, onProgress, method, action } =
			options;

		try {
			const response: TImageResponse =
				await updaloadImageMutation.mutateAsync(file as File);
			(file as UploadFile).url = response.publicUrl;
			onSuccess && onSuccess({ url: response.publicUrl });
		} catch (error) {
			console.error("Error occurred while uploading images:", error);
			onError && onError(error as any);
		}
	};

	return (
		<div>
			<p>
				Tối thiểu {minCount} - Tối đa {maxCount}
			</p>
			{errorMessage && (
				<p className="p-0 m-0 text-red-500">{errorMessage}</p>
			)}
			<ImgCrop rotationSlider zoomSlider aspectSlider showReset>
				<Upload
					listType="picture-card"
					fileList={fileList}
					onPreview={handlePreview}
					onChange={handleChange}
					onRemove={onRemove ? onRemove : undefined}
					supportServerRender
				>
					{fileList?.length >= maxCount ? null : uploadButton}
				</Upload>
			</ImgCrop>
			{previewImage && (
				<Image
					wrapperStyle={{ display: "none" }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) =>
							!visible && setPreviewImage(null),
					}}
					src={previewImage}
					alt={previewImage}
				/>
			)}
		</div>
	);
};

export default InputImages;
