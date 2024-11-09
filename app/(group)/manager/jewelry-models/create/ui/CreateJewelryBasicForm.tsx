"use client";
import { App, Button, Form, Space, Switch, Tag } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { JewelryMaterialUsageForm } from "@/app/(group)/manager/jewelry-models/shared";
import { KEY_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { jewelryService, materialUsageService } from "@/services";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import jewelryValidation from "@/validations/jewelryValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { createJewelryStore } from "../store";

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
	"id",
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
	const account = useAccountStore((state) => state.account);
	const methods = useForm<TFormJewelry>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
		mode: "onChange",
	});
	const {
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
	} = methods;
	console.log("🚀 ~ errors:", errors);
	const { setJewelry, next } = createJewelryStore();
	const message = App.useApp().message;
	const {
		data,
		mutate: handleCreate,
		isPending,
	} = useMutation({
		mutationFn: async (data: TFormJewelry) => {
			console.log("🚀 ~ mutate ~ data:", data);
			const newJewelry = await jewelryService.create({
				...data,
				name: data.name.trim(),
				sku: "",
				coverImage: "",
				manager: { id: account?.id! },
				isCoverSearch: false,
			});
			console.log("🚀 ~ mutationFn: ~ newJewelry:", newJewelry);

			await materialUsageService.createMultiple(
				data.materials.map((item) => ({
					material: { id: item.material.id },
					usage: item.usage,
					price: item.price,
					jewelry: { id: newJewelry.id },
				}))
			);
			const sku: string = "HKJ" + newJewelry.id;
			return await jewelryService.updatePartical({
				id: newJewelry.id,
				sku,
				name: `${newJewelry.name} ${sku}`,
			});
		},
		onSuccess(data, variables, context) {
			message.success("Đã tạo trang sức thành công");
			setJewelry(data);
			next();
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	const handleSubmitTest = (data: TFormJewelry) => {
		console.log("🚀 ~ handleSubmitTest ~ data:", data);
		return {};
	};
	return (
		<FormProvider {...methods}>
			<Form
				layout="vertical"
				className="w-full flex flex-col gap-5"
				onFinish={handleSubmit((data: TFormJewelry) =>
					handleCreate(data)
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
						Tạo
					</Button>
				</div>
			</Form>
		</FormProvider>
	);
};

export default CreateBasicForm;
