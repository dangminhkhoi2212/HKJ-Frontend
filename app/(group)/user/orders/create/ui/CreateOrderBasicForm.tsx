"use client";
import { App, Button, Form, Space, Spin } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill-new";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { jewelryService, orderService } from "@/services";
import {
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import useAccountStore from "@/stores/account";
import { TOrder, TOrderCreate, TStatus } from "@/types";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { createOrderStore } from "../store";
import ProductCard from "./ProductCard";

const schema = orderValidation.orderSchema.pick([
	"orderDate",
	"specialRequests",
	"status",
	"budget",
	"customer",
	"jewelry",
	"category",
]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	orderDate: dayjs().toISOString(),
	specialRequests: "",
	status: TStatus.NEW,
	budget: 0,
	customer: { id: 0 },
	category: { id: 0 },
	jewelry: { id: null },
};
type Props = {};

const CreateOrderBasicForm: React.FC<Props> = ({}) => {
	const { searchParams } = useRouterCustom();
	const account = useAccountStore((state) => state.account);
	const setOrder = createOrderStore((state) => state.setOrder);
	const next = createOrderStore((state) => state.next);
	const pId: string | null = searchParams.get("pId");
	const {
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: { ...initValues, customer: { id: account?.id } },
		resolver: yupResolver(schema),
	});
	console.log("🚀 ~ errors:", errors);
	const message = App.useApp().message;
	const createOrder = useMutation({
		mutationFn: (data: TForm) => {
			console.log("🚀 ~ data:", data);
			const dataConvert: TOrderCreate = {
				...data,
				orderDate: dayjs(data.orderDate).toISOString(),
				customer: { id: data.customer.id },
				jewelry: pId ? { id: Number.parseInt(pId) } : null,
			};
			console.log("🚀 ~ dataConvert:", dataConvert);
			return orderService.create(dataConvert);
		},
		onSuccess: (data: TOrder) => {
			setOrder(data);
			next();
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	const getProduct = useQuery({
		queryKey: ["product", pId],
		queryFn: () => {
			return jewelryService.getOne(pId!);
		},
		enabled: !!pId,
	});

	useEffect(() => {
		if (getProduct.isSuccess) {
			setValue("jewelry.id", getProduct.data.id);
		}
	}, [getProduct.data]);

	return (
		<Spin spinning={createOrder.isPending}>
			<Form
				layout="vertical"
				onFinish={handleSubmit((data) => createOrder.mutate(data))}
				className="flex flex-col gap-4"
			>
				{account && <AccountDisplay account={account} />}
				<div className="grid grid-cols-1 md:grid-cols-2  gap-4">
					<div className="flex flex-col gap-4">
						<Space direction="vertical">
							<SelectCategoryForm
								status={
									errors.category?.message ||
									errors.category?.id?.message
										? "error"
										: ""
								}
								onChange={(value) =>
									setValue("category.id", value, {
										shouldValidate: true,
									})
								}
							/>
							<span className="text-red-500">
								{errors.category?.message ||
									errors.category?.id?.message}
							</span>
						</Space>
						<InputNumberCustom
							control={control}
							name="budget"
							label="Ngân sách của bạn"
							errorMessage={errors?.budget?.message}
							extra={
								<div>
									<p>
										Giá cả này giúp cửa hàng có thể cân nhắc
										các chất liệu chế tác cho phù hợp nhất
									</p>
									<p>
										Giá cả sau khi chế tác có thể nhiều hoặc
										ít hơn giá bạn mong muốn một ít
									</p>
								</div>
							}
						/>
						<Space direction="vertical" className="flex">
							<LabelCustom
								label="Yêu cầu cụ thể"
								required={false}
							/>
							<ReactQuill
								onChange={(value) =>
									setValue("specialRequests", value)
								}
							/>
						</Space>
					</div>
					<ProductCard />
				</div>
				<div className="flex justify-end">
					<Button type="primary" htmlType="submit">
						Đặt hàng
					</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default CreateOrderBasicForm;
