"use client";
import { App, Button, Form, Space, Spin, Switch, Tag } from 'antd';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { KEY_CONST } from '@/const';
import { jewelryService } from '@/services';
import { InputCustom, InputNumberCustom, LabelCustom } from '@/shared/FormCustom/InputCustom';
import NumberToWords from '@/shared/FormCustom/InputNumToWords/InputNumToWords';
import { SelectMaterialForm } from '@/shared/FormSelect';
import { SelectCategoryForm } from '@/shared/FormSelect/SelectCategoryForm';
import { TJewelry } from '@/types';
import { generateUtil } from '@/utils';
import jewelryValidation from '@/validations/jewelryValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateJewelryModelStore } from '../store';

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});
const schema = jewelryValidation.jewelrySchema.omit([
	"manager",
	"project",
	"coverImage",
	"images",
]);
type Props = {};

type TFormJewelry = yup.InferType<
	yup.ObjectSchema<typeof schema>
>["__outputType"];
const initValue: TFormJewelry = {
	id: 0,
	name: "",
	sku: "",
	weight: 0,
	color: "",
	active: true,
	isCustom: false,
	price: 0,
	description: "",
	category: { id: 0 },
	material: { id: 0 },
};

const UpdateBasicForm: React.FC<Props> = () => {
	const jewelry = updateJewelryModelStore((state) => state.jewelry);
	const setJewelry = updateJewelryModelStore((state) => state.setJewelry);
	const queryClient = useQueryClient();
	const methods = useForm<TFormJewelry>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
	});
	const {
		control,
		watch,
		handleSubmit,
		getValues,
		setValue,
		reset,
		formState: { errors },
	} = methods;
	console.log("🚀 ~ errors:", errors);
	const message = App.useApp().message;

	useEffect(() => {
		if (jewelry) {
			console.log("🚀 ~ useEffect ~ jewelry:", jewelry);

			reset(jewelry);
		}
	}, [jewelry]);

	const { data, mutate, isPending } = useMutation({
		mutationFn: (data: TFormJewelry) => {
			console.log("🚀 ~ mutate ~ data:", data);

			return jewelryService.update({
				...jewelry!,
				...data!,
			});
		},
		onSuccess(data, variables, context) {
			message.success("Đã cập nhật trang sức thành công");
			setJewelry(data);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<FormProvider {...methods}>
			<Spin spinning={isPending}>
				<Form
					layout="vertical"
					className="w-full flex flex-col gap-5"
					onFinish={handleSubmit((data: TFormJewelry) =>
						mutate(data)
					)}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
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
							<InputCustom
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
							/>
							<NumberToWords number={watch("price")} />
						</Space>
						<Space
							className="col flex"
							direction="vertical"
							size="large"
						>
							<Space direction="vertical">
								<SelectCategoryForm
									placeholder="Chọn loại trang sức"
									onChange={(value) => {
										setValue("category.id", value, {
											shouldValidate: true,
										});
									}}
									value={watch("category.id")}
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
							<Space direction="vertical">
								<SelectMaterialForm
									placeholder="Chọn chất liệu"
									onChange={(value) => {
										setValue("material.id", value, {
											shouldValidate: true,
										});
									}}
									value={watch("material.id")}
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
							</Space>

							<Controller
								control={control}
								name="active"
								render={({ field }) => (
									<Space direction="vertical">
										<LabelCustom label="Trạng thái" />
										<Space>
											<Switch {...field} />
											{watch("active") ? (
												<Tag color="green">
													Hiển thị
												</Tag>
											) : (
												<Tag color="red">
													Không hiển thị
												</Tag>
											)}
										</Space>
									</Space>
								)}
							/>
							<Controller
								control={control}
								name="isCustom"
								render={({ field }) => (
									<Space direction="vertical">
										<LabelCustom label="Chỉnh sửa" />
										<Space>
											<Switch {...field} />
											{watch("isCustom") ? (
												<Tag color="gold">
													Đã chỉnh sửa
												</Tag>
											) : (
												<Tag color="green">
													Sản phẩm mới
												</Tag>
											)}
										</Space>
									</Space>
								)}
							/>
							<Space>
								<p>
									Mã SKU:{" "}
									<span>
										{generateUtil.generateSKU(
											watch() as TJewelry
										)}
									</span>
								</p>
							</Space>
						</Space>
					</div>

					<div>
						<Space direction="vertical" className="flex">
							<LabelCustom label="Mô tả" />
							<ReactQuill
								theme="snow"
								value={getValues("description")}
								onChange={(value) =>
									setValue("description", value)
								}
							/>
						</Space>
					</div>

					<div className="flex justify-end">
						<Button
							type="primary"
							htmlType="submit"
							loading={isPending}
						>
							Cập nhật
						</Button>
					</div>
				</Form>
			</Spin>
		</FormProvider>
	);
};

export default UpdateBasicForm;
