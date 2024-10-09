"use client";
import { App, Button, Form, Space, Switch, Tag } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { jewelryService } from "@/services";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import jewelryValidation from "@/validations/jewelryValidation";
import { yupResolver } from "@hookform/resolvers/yup";

import { createJewelryStore } from "../../store";

const CreateDescription = dynamic(() => import("./CreateDescription"), {
	ssr: false,
});
const schema = jewelryValidation.jewelrySchema.omit([
	"id",
	"coverImage",
	"images",
	"manager",
	"project",
]);
type Props = {};

type TFormJewelry = yup.InferType<
	yup.ObjectSchema<typeof schema>
>["__outputType"];
const initValue: TFormJewelry = {
	name: "",
	wieght: 0,
	color: "",
	active: true,
	isCustom: false,
	price: 0,
	description: "",
	category: { id: 0 },
};
const CreateBasicForm: React.FC<Props> = () => {
	const methods = useForm<TFormJewelry>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
	});
	const {
		control,
		watch,
		handleSubmit,
		formState: { errors },
	} = methods;
	console.log("🚀 ~ errors:", errors);
	const { setJewelry, next } = createJewelryStore();
	const message = App.useApp().message;
	const { data, mutate, isLoading } = useMutation({
		mutationFn: (data: TFormJewelry) => {
			console.log("🚀 ~ mutate ~ data:", data);

			return jewelryService.create({
				...data,
			});
		},
		onSuccess(data, variables, context) {
			message.success("Đã tạo trang sức thành công");
			setJewelry(data);
			next();
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<FormProvider {...methods}>
			<Form
				layout="vertical"
				className="w-full flex flex-col gap-5"
				onFinish={handleSubmit((data: TFormJewelry) => mutate(data))}
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
							name="wieght"
							label="Khối lượng"
							placeholder="Khối lượng"
							errorMessage={errors?.wieght?.message!}
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
						<Controller
							control={control}
							name="category.id"
							render={({ field }) => (
								<SelectCategoryForm
									onChange={(value) => field.onChange(value)}
									errorMessage={
										errors?.category?.id?.message!
									}
								/>
							)}
						/>
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
						<Controller
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
						/>
					</Space>
				</div>

				<div>
					<CreateDescription />
				</div>
				<div className="flex justify-end">
					<Button
						type="primary"
						// htmlType="submit"
						loading={isLoading}
						onClick={() => next()}
					>
						Tạo
					</Button>
				</div>
			</Form>
		</FormProvider>
	);
};

export default CreateBasicForm;
