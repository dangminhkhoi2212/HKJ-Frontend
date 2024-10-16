"use client";
import { App, Button, Divider, Form, Space, Spin } from "antd";
import { UploadFile } from "antd/lib";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { materialImageService, materialService } from "@/services";
import supabaseService from "@/services/supabaseService";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { TMaterial } from "@/types";
import { imageUtil } from "@/utils";
import materialValidation from "@/validations/materialValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

type Props = {
	id: number;
};

type TForm = Omit<TMaterial, "coverImage"> & {
	coverImage: UploadFile[];
	images: UploadFile[];
};

const DEFAULT_VALUES: TForm = {
	id: -1,
	name: "",
	quantity: 0,
	unit: "",
	unitPrice: 0,
	supplier: "",
	coverImage: [],
	images: [],
};

const ExtraUnitPrice: React.FC<{
	unitPrice: number;
	unit: string;
}> = ({ unitPrice, unit }) => {
	if (!unitPrice || !unit) return null;
	return (
		<Space direction="vertical">
			<span>Ví dụ: 500,000/ gam</span>
			<span>{`${unitPrice.toLocaleString("vi-VN")} VND/${unit}`}</span>
		</Space>
	);
};

const UpdateMaterialForm: React.FC<Props> = ({ id }) => {
	const { message } = App.useApp();
	const [form] = Form.useForm();
	const { convertToUploadFile, updateImageMapper } = imageUtil;
	const {
		control,
		handleSubmit,
		getValues,
		watch,
		setValue,
		formState: { errors },
		reset,
	} = useForm<TForm>({
		defaultValues: DEFAULT_VALUES,
		resolver: yupResolver(materialValidation.materialSchema),
	});

	const {
		data: currentMaterial,
		refetch: refetchMaterial,
		isSuccess: isSuccessMaterial,
		isPending: isPendingMaterial,
	} = useQuery({
		queryKey: ["material", id],
		queryFn: () => materialService.getOne({ id }),
	});
	const {
		data: currenImages,
		refetch: refretchImages,
		isSuccess: isSuccessImages,
		isPending: isPendingMaterialImage,
	} = useQuery({
		queryKey: ["material-images", { id }],
		queryFn: () =>
			materialImageService.get({ materialId: { equals: id.toString() } }),
	});
	useEffect(() => {
		if (isSuccessMaterial) {
			const data = currentMaterial;
			const dataMapper: TForm = {
				...data,
				coverImage: data.coverImage
					? [convertToUploadFile({ url: data.coverImage })]
					: [],
				images: [],
			};
			reset(dataMapper);
		}
	}, [currentMaterial, refetchMaterial]);

	useEffect(() => {
		if (isSuccessImages) {
			const data = currenImages;
			setValue(
				"images",
				data.map((image) => convertToUploadFile(image))
			);
		}
	}, [currenImages, refretchImages]);

	const handleUpdateImage = async () => {
		const folderImage = supabaseService.createImagesFolder(
			"materials",
			currentMaterial?.id!
		);
		const changedImages = getValues("images");
		const { keepImages, newImagesUpdate, imagesDelete } = updateImageMapper(
			changedImages,
			currenImages! || []
		);

		const promise = [];
		//upload image in cloud
		if (newImagesUpdate.length) {
			const uploadedNewImageUrls = await supabaseService.uploadAnDelete(
				keepImages.map((image) => image.url),
				newImagesUpdate.map((file) =>
					supabaseService.convertFile(file)
				),
				folderImage
			);
			if (uploadedNewImageUrls.length) {
				//create new images in db
				promise.push(
					materialImageService.createMultiple(
						uploadedNewImageUrls.map((url) => ({
							url,
							material: { id: currentMaterial?.id },
						}))
					)
				);
			}
		}

		if (imagesDelete.length) {
			//delete old images in db
			promise.push(
				materialImageService.deleteMultiple(
					imagesDelete.map((item) => item.id)
				)
			);
		}

		await Promise.all(promise);
	};

	const handleUpdateCoverImage = async (): Promise<string | null> => {
		const coverImage: UploadFile | undefined = getValues("coverImage")[0];
		if (!coverImage?.url) {
			// if cover have not url => new cover image file
			const folder = supabaseService.createCoverFolder(
				"materials",
				currentMaterial?.id!
			);

			const coverImageUrl: string[] =
				await supabaseService.uploadAnDelete(
					[],
					[supabaseService.convertFile(coverImage!)],
					folder
				);
			return coverImageUrl[0];
		}

		return null;
	};

	const updateMaterialMutation = useMutation({
		mutationFn: async (data: TForm) => {
			if (!currentMaterial) return;

			const [newCoverImage, newImages] = await Promise.all([
				handleUpdateCoverImage(),
				handleUpdateImage(),
			]);
			// Handle multiple images
			// // Update material

			const { coverImage, images, ...rest } = data;

			return materialService.update({
				...rest,
				coverImage: newCoverImage || currentMaterial.coverImage,
			});
		},
		onSuccess: () => {
			message.success("Đã cập nhật thành công");
			refreshData();
		},
		onError: (error) => {
			console.error("Update failed:", error);
			message.error("Cập nhật thất bại");
		},
	});

	const handleImageChange = (
		newFileList: UploadFile[],
		file: UploadFile,
		fieldName: "images" | "coverImage"
	) => {
		setValue(fieldName, newFileList, { shouldValidate: true });
	};

	const refreshData = useCallback(() => {
		refetchMaterial();
		refretchImages();
	}, []);

	const isLoading =
		isPendingMaterial ||
		isPendingMaterialImage ||
		updateMaterialMutation.isPending;
	return (
		<Spin spinning={isLoading}>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit((data) =>
					updateMaterialMutation.mutate(data)
				)}
			>
				<div className="grid grid-cols-2 gap-8">
					<Space direction="vertical" size="middle">
						<InputCustom
							control={control}
							name="name"
							label="Tên loại nguyên liệu"
							errorMessage={errors.name?.message}
						/>
						<InputNumberCustom
							control={control}
							name="quantity"
							label="Số lượng nhập"
							max={1000000}
							min={0}
							errorMessage={errors.quantity?.message}
						/>
						<InputCustom
							control={control}
							name="unit"
							label="Đơn vị"
							errorMessage={errors.unit?.message}
						/>
					</Space>
					<Space direction="vertical" size="middle">
						<div>
							<InputNumberCustom
								control={control}
								name="unitPrice"
								suffix=" VND"
								label="Giá mỗi đơn vị"
								defaultValue={0}
								extra={
									<ExtraUnitPrice
										unitPrice={getValues("unitPrice")}
										unit={getValues("unit")}
									/>
								}
								errorMessage={errors.unitPrice?.message}
							/>
							<NumberToWords number={getValues("unitPrice")} />
						</div>
						<InputCustom
							control={control}
							name="supplier"
							label="Nhà cung cấp"
							errorMessage={errors.supplier?.message}
						/>
					</Space>
					<div>
						<Space direction="vertical">
							<LabelCustom label="Ảnh bìa" required />
							<InputImage
								onChange={(fileList, file) =>
									handleImageChange(
										fileList,
										file,
										"coverImage"
									)
								}
								images={watch("coverImage") || []}
								maxCount={1}
							/>
							<span className="text-red-500">
								{errors?.coverImage?.message?.toString()}
							</span>
						</Space>
						<Divider className="my-2" />
						<Space direction="vertical">
							<LabelCustom label="Hình ảnh" required />
							<InputImage
								onChange={(fileList, file) =>
									handleImageChange(fileList, file, "images")
								}
								images={watch("images") || []}
								maxCount={30}
							/>{" "}
							<span className="text-red-500">
								{errors?.images?.message?.toString()}
							</span>
						</Space>
					</div>
				</div>
				<div className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						loading={updateMaterialMutation.isPending}
					>
						Cập nhật
					</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default UpdateMaterialForm;
