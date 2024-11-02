"use client";
import { App, Button, Form, Space } from "antd";
import { UploadFile } from "antd/lib";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { jewelryImageService, jewelryService } from "@/services";
import supabaseService from "@/services/supabaseService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import { TJewelryImageCreate } from "@/types/jewelryImageType";
import jewelryValidation from "@/validations/jewelryValidation";
import { useMutation } from "@tanstack/react-query";

import { createJewelryStore } from "../store";

const schema = jewelryValidation.jewelrySchema.pick(["coverImage", "images"]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];

const intiValue: TForm = {
	images: [],
	coverImage: [],
};

const CreateImageForm: React.FC<{}> = () => {
	const {
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<TForm>({ defaultValues: intiValue });
	console.log("🚀 ~ UploadImageForm ~ errors:", errors);

	const handleImageChange = useCallback(
		(fileList: UploadFile[], fieldName: "images" | "coverImage") => {
			if (fileList.length) {
				setValue(fieldName, fileList, { shouldValidate: true });
			}
		},
		[setValue]
	);
	const { jewelry, next, setJewelry } = createJewelryStore();
	const message = App.useApp().message;
	const createImages = async () => {
		const images = getValues("images");
		const folderImage = supabaseService.createImagesFolder(
			"jewelry-models",
			jewelry?.id!
		);
		const imageUrls: string[] = await supabaseService.uploadMultiple(
			images,
			folderImage
		);
		const imagesCreate: TJewelryImageCreate[] = imageUrls.map((url) => {
			return {
				url: url,
				jewelryModel: { id: jewelry?.id! },
				isSearchImage: false,
			};
		});

		await jewelryImageService.createMultiple(imagesCreate);
	};
	const createCoverImage = async () => {
		const images = getValues("coverImage");
		const folderImage = supabaseService.createCoverFolder(
			"jewelry-models",
			jewelry?.id!
		);
		const imageUrls: string[] = await supabaseService.uploadMultiple(
			images,
			folderImage
		);
		console.log("🚀 ~ createCoverImage ~ imageUrls:", imageUrls);

		const newJewelry = await jewelryService.update({
			...jewelry!,
			coverImage: imageUrls[0],
			isCoverSearch: false,
		});
		setJewelry(newJewelry);
	};
	const { data, mutate, isPending } = useMutation({
		mutationFn: async () => {
			return await Promise.all([
				await createImages(),
				await createCoverImage(),
			]);
		},
		onSuccess() {
			message.success("Đã thêm hình ảnh thành công");
			next();
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<Form layout="vertical" onFinish={handleSubmit((data) => mutate())}>
			<Space direction="vertical" size={"middle"} className="flex">
				<div>
					<LabelCustom label="Ảnh bìa" required />
					<InputImage
						onChange={(fileList) =>
							handleImageChange(fileList, "coverImage")
						}
						maxCount={1}
						errorMessage={errors.images?.message}
					/>
				</div>
				<div>
					<LabelCustom label="Ảnh trang sức" required />
					<InputImage
						maxCount={30}
						onChange={(fileList) =>
							handleImageChange(fileList, "images")
						}
						errorMessage={errors.images?.message}
					/>
				</div>
				<Space className="flex justify-end">
					<Button
						disabled={isPending}
						onClick={() => {
							next();
						}}
					>
						Xong
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						loading={isPending}
					>
						Thêm
					</Button>
				</Space>
			</Space>
		</Form>
	);
};

export default CreateImageForm;
