"use client";
import { App, Button, Divider, Form, Space, Spin } from "antd";
import { UploadFile } from "antd/lib";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import {
	imageSearchAIService,
	jewelryImageService,
	jewelryService,
} from "@/services";
import supabaseService from "@/services/supabaseService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import { TJewelry, TJewelryImage } from "@/types";
import { imageUtil } from "@/utils";
import jewelryValidation from "@/validations/jewelryValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries } from "@tanstack/react-query";

import { updateJewelryModelStore } from "../store";

type Props = {};
const schema = jewelryValidation.jewelrySchema.pick([
	"coverImage",
	"images",
	"id",
]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValue = {
	id: 0,
	coverImage: [],
	images: [],
};
const { convertToUploadFile, updateImageMapper } = imageUtil;
const UpdateImagesForm: React.FC<Props> = ({}) => {
	const jewelry = updateJewelryModelStore((state) => state.jewelry);
	const setJewelry = updateJewelryModelStore((state) => state.setJewelry);

	const {
		watch,
		setValue,
		getValues,
		reset,
		formState: { errors },
		handleSubmit,
	} = useForm<TForm>({
		defaultValues: { ...initValue, id: jewelry?.id },
		resolver: yupResolver(schema),
	});
	const message = App.useApp().message;

	console.log("🚀 ~ errors:", errors);
	const handleImageChange = (
		newFileList: UploadFile[],
		file: UploadFile,
		fieldName: "images" | "coverImage"
	) => {
		setValue(fieldName, newFileList, { shouldValidate: true });
	};
	useEffect(() => {
		setValue("id", jewelry?.id!);
	}, [jewelry?.id]);
	const [getJewelryImages] = useQueries({
		queries: [
			{
				queryKey: ["jewelry-images", jewelry?.id],
				queryFn: () =>
					jewelryImageService.get({
						jewelryModelId: { equals: jewelry?.id },
						isDeleted: { equals: false },
					}),
				enabled: !!jewelry?.id,
			},
		],
	});

	useEffect(() => {
		if (jewelry) {
			const data: TJewelry = jewelry;
			setValue(
				"coverImage",
				data.coverImage
					? [convertToUploadFile({ url: data.coverImage })]
					: []
			);
		}
	}, [jewelry]);

	useEffect(() => {
		if (getJewelryImages.isSuccess) {
			const data: TJewelryImage[] = getJewelryImages?.data!;
			setValue(
				"images",

				data?.map((image) => convertToUploadFile(image))
			);
		}
	}, [getJewelryImages.refetch, getJewelryImages.data]);

	const handleUpdateCoverImage = async (): Promise<string | null> => {
		const coverImage: UploadFile | undefined = getValues("coverImage")[0];
		if (!coverImage?.url) {
			// if cover have not url => new cover image file
			const folder = supabaseService.createCoverFolder(
				"jewelry-models",
				jewelry?.id!
			);

			const [coverImageUrl, _] = await Promise.all([
				await supabaseService.uploadAnDelete(
					[],
					[supabaseService.convertFile(coverImage!)],
					folder
				),

				await imageSearchAIService.removeImages([jewelry?.id!]),
			]);
			return coverImageUrl[0];
		}

		return null;
	};
	const handleUpdateImage = async () => {
		const folderImage = supabaseService.createImagesFolder(
			"jewelry-models",
			jewelry?.id!
		);
		const changedImages = getValues("images");
		const { keepImages, newImagesUpdate, imagesDelete } = updateImageMapper(
			changedImages,
			getJewelryImages.data || []
		);
		console.log("🚀 ~ handleUpdateImage ~ changedImages:", changedImages);
		console.log(
			"🚀 ~ handleUpdateImage ~ newImagesUpdate:",
			newImagesUpdate
		);
		console.log("🚀 ~ handleUpdateImage ~ keepImages:", keepImages);
		console.log("🚀 ~ handleUpdateImage ~ imagesDelete:", imagesDelete);

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
					jewelryImageService.createMultiple(
						uploadedNewImageUrls.map((url) => ({
							url,
							jewelryModel: { id: jewelry?.id! },
							isSearchImage: false,
						}))
					)
				);
			}
		}

		if (imagesDelete.length) {
			//delete old images in db
			promise.push(
				jewelryImageService.deleteMultiple(
					imagesDelete.map((item) => item.id)
				)
			);
		}

		await Promise.all(promise);
	};
	const updateJewelryMutation = useMutation({
		mutationFn: async (data: TForm) => {
			const [newCoverImage, newImages] = await Promise.all([
				handleUpdateCoverImage(),
				handleUpdateImage(),
			]);
			// Handle multiple images
			// // Update material

			const { coverImage, images, ...rest } = data;

			return jewelryService.updatePartical({
				id: rest?.id!,
				coverImage: newCoverImage || jewelry?.coverImage!,
			});
		},
		onSuccess: (data: TJewelry) => {
			message.success("Đã cập nhật thành công");
			setJewelry(data);
		},
		onError: (error) => {
			console.error("Update failed:", error);
			message.error("Cập nhật thất bại");
		},
	});
	const handleUpdate = (data: TForm) => {
		updateJewelryMutation.mutate(data);
	};
	const refresh = useCallback(() => {
		getJewelryImages.refetch();
	}, []);

	useEffect(() => {
		return () => reset(initValue);
	}, []);
	const isLoading =
		getJewelryImages.isPending || updateJewelryMutation.isPending;
	return (
		<Spin spinning={isLoading}>
			<Form onFinish={handleSubmit(handleUpdate)}>
				<div>
					<Space direction="vertical">
						<LabelCustom label="Ảnh bìa" required />
						<InputImage
							onChange={(fileList, file) =>
								handleImageChange(fileList, file, "coverImage")
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
				<Space className="flex justify-end">
					<Button type="primary" htmlType="submit">
						Cập nhật
					</Button>
				</Space>
			</Form>
		</Spin>
	);
};

export default UpdateImagesForm;
