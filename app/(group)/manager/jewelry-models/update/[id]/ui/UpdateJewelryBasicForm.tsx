"use client";
import { App, Button, Form, Space, Switch, Tag } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { JewelryMaterialUsageForm } from "@/app/(group)/manager/jewelry-models/shared";
import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { jewelryService, materialUsageService } from "@/services";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { TMaterialUsage } from "@/types";
import jewelryValidation from "@/validations/jewelryValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { updateJewelryModelStore } from "../store";

const JewelryDescriptionForm = dynamic(
	() =>
		import("@/app/(group)/manager/jewelry-models/shared").then(
			(mod) => mod.JewelryDescriptionForm
		),
	{
		ssr: false,
	}
);
const schema = jewelryValidation.jewelrySchema.omit([
	"coverImage",
	"images",
	"manager",
	"project",
	"sku",
]);
type Props = {};

type TFormJewelry = yup.InferType<
	yup.ObjectSchema<typeof schema>
>["__outputType"];
const initValue: TFormJewelry = {
	id: 0,
	name: "",
	active: true,
	price: 0,
	description: "",
	category: { id: 0 },
	materials: [
		{
			id: 0,
			material: { id: 0, pricePerUnit: 0, unit: "" },
			price: 0,
			usage: 0,
		},
	],
};
const CreateBasicForm: React.FC<Props> = () => {
	const jewelry = updateJewelryModelStore((state) => state.jewelry);
	const params = useRouterCustom().params;
	const account = useAccountStore((state) => state.account);
	const methods = useForm<TFormJewelry>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
		mode: "all",
	});
	const {
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
		reset,
	} = methods;
	console.log("🚀 ~ errors:", errors);
	const { setJewelry } = updateJewelryModelStore();
	const message = App.useApp().message;

	const updateMaterialUsage = async (data: TFormJewelry) => {
		const existingMaterials = jewelry?.materials || [];
		console.log(
			"🚀 ~ updateMaterialUsage ~ existingMaterials:",
			existingMaterials
		);

		// Xác định các chất liệu mới
		const newMaterials = data.materials.filter((item) => !item.id);
		console.log("🚀 ~ updateMaterialUsage ~ newMaterials:", newMaterials);

		// Xác định các chất liệu cần cập nhật
		const materialsToUpdate = data.materials.filter((item) => item.id);
		console.log(
			"🚀 ~ updateMaterialUsage ~ materialsToUpdate:",
			materialsToUpdate
		);

		// Tạo Set cho các ID của chất liệu mới
		const udpateMaterialIds = new Set(
			materialsToUpdate.map((item) => item.id)
		);

		// Xác định các chất liệu cần xóa
		const materialIdsToDelete = existingMaterials
			.filter((item: TMaterialUsage) => !udpateMaterialIds.has(item.id))
			.map((item: TMaterialUsage) => item.id);

		console.log(
			"🚀 ~ updateMaterialUsage ~ materialsToDelete:",
			materialIdsToDelete
		);

		await Promise.all([
			newMaterials.length > 0 &&
				(await materialUsageService.createMultiple(
					newMaterials.map((item) => ({
						material: { id: item.material.id },
						usage: item.usage,
						price: item.price,
						jewelry: { id: params?.id },
					}))
				)),
			materialsToUpdate.length > 0 &&
				(await materialUsageService.updateMultiple(
					materialsToUpdate.map((item) => ({
						id: item.id!,
						usage: item.usage,
						price: item.price,
						jewelry: { id: params?.id },
						material: { id: item.material.id },
					}))
				)),
			materialIdsToDelete.length > 0 &&
				(await materialUsageService.deleteMultiple(
					materialIdsToDelete
				)),
		]);
	};

	const {
		data: _,
		mutate: handleUpdate,
		isPending,
	} = useMutation({
		mutationFn: async (data: TFormJewelry) => {
			console.log("🚀 ~ mutate ~ data:", data);
			const { materials, ...rest } = data;
			const newJewelry = await jewelryService.updatePartical({
				...rest,
				name: data.name.trim(),
			});
			console.log("🚀 ~ mutationFn: ~ newJewelry:", newJewelry);
			await updateMaterialUsage(data);
			return newJewelry;
		},
		onSuccess(data, variables, context) {
			message.success("Đã cập nhật trang sức thành công");
			setJewelry(data);
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	useEffect(() => {
		if (jewelry && jewelry?.materials) {
			reset({
				id: jewelry.id,
				name: jewelry.name,
				active: jewelry.active,
				price: jewelry?.price,
				description: jewelry?.description,
				category: {
					id: jewelry?.category?.id,
				},
				materials:
					jewelry?.materials?.map((item: TMaterialUsage) => ({
						id: item.id,
						material: {
							id: item?.material?.id,
							pricePerUnit: item?.material?.pricePerUnit,
							unit: item?.material?.unit,
						},
						jewelry: { id: item?.jewelry?.id },
						price: item.price,
						usage: item.usage,
					})) || [], // Đảm bảo rằng materials không phải là undefined
			});
		}
	}, [jewelry]);
	const handleSubmitTest = (data: TFormJewelry) => {
		console.log("🚀 ~ handleSubmitTest ~ data:", data);
		updateMaterialUsage(data);
		return {};
	};
	return (
		<FormProvider {...methods}>
			<Form
				layout="vertical"
				className="w-full flex flex-col gap-5"
				onFinish={handleSubmit((data: TFormJewelry) =>
					handleUpdate(data)
				)}
			>
				<div className="grid grid-cols-1 md:grid-cols-3 w-full gap-5">
					<Space
						direction="vertical"
						className="col flex-col"
						size="large"
					>
						<InputCustom
							control={control}
							name="name"
							label="Tên trang sức"
							placeholder="Tên trang sức"
							errorMessage={errors?.name?.message!}
						/>
						{/* <InputCustom
							control={control}
							name="color"
							label="Màu sắc"
							placeholder="Màu sắc"
							errorMessage={errors?.color?.message!}
						/>
						<InputNumberCustom
							control={control}
							name="weight"
							label="Khối lượng"
							placeholder="Khối lượng"
							errorMessage={errors?.weight?.message!}
							className="max-w-44"
							suffix=" gram"
						/>
						<InputNumberCustom
							control={control}
							name="price"
							label="Giá"
							placeholder="Giá"
							errorMessage={errors?.price?.message!}
							className="max-w-44"
							suffix=" VND"
						/> */}

						<Space direction="vertical">
							<SelectCategoryForm
								className="w-32"
								placeholder="Chọn loại trang sức"
								value={watch("category.id")}
								onChange={(value) => {
									setValue("category.id", value, {
										shouldValidate: true,
									});
								}}
								status={
									(errors?.category?.message ||
										errors?.category?.id?.message) &&
									"error"
								}
							/>
							<span className="text-red-500">
								{errors?.category?.message ||
									errors?.category?.id?.message}
							</span>
						</Space>
						{/* <Space direction="vertical">
							<SelectMaterialForm
								className="w-32"
								onChange={(value) => {
									setValue("material.id", value, {
										shouldValidate: true,
									});
								}}
								status={
									(errors?.material?.message ||
										errors?.material?.id?.message) &&
									"error"
								}
							/>
							<span className="text-red-500">
								{errors?.material?.message ||
									errors?.material?.id?.message}
							</span>
						</Space> */}
						<Controller
							control={control}
							name="active"
							render={({ field }) => (
								<Space direction="vertical">
									<LabelCustom label="Trạng thái" />
									<Space>
										<Switch {...field} />
										{watch("active") ? (
											<Tag color="green">Hiển thị</Tag>
										) : (
											<Tag color="red">
												Không hiển thị
											</Tag>
										)}
									</Space>
								</Space>
							)}
						/>
						{/* <Controller
							control={control}
							name="isCustom"
							render={({ field }) => (
								<Space direction="vertical">
									<LabelCustom label="Chỉnh sửa" />
									<Space>
										<Switch {...field} />
										{watch("isCustom") ? (
											<Tag color="gold">Đã chỉnh sửa</Tag>
										) : (
											<Tag color="green">
												Sản phẩm mới
											</Tag>
										)}
									</Space>
								</Space>
							)}
						/> */}
					</Space>
					<Space
						className="col-span-2 flex"
						direction="vertical"
						size="large"
					>
						<JewelryMaterialUsageForm />
					</Space>
				</div>

				<div>
					<JewelryDescriptionForm />
				</div>
				<div className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						loading={isPending}
						// onClick={() => next()}
					>
						Cập nhật
					</Button>
				</div>
			</Form>
		</FormProvider>
	);
};

export default CreateBasicForm;
