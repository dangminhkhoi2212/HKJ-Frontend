"use client";
import { App, Card, Col, Form, Row, Spin, Typography } from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { orderImageService, orderService } from "@/services";
import orderItemService from "@/services/orderItemService";
import supabaseService from "@/services/supabaseService";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { OrderDateInfo, OrderItemForm } from "@/shared/OrderForm";
import OrderDetailAction from "@/shared/OrderForm/OrderDetailAction";
import {
	TCartItemSession,
	TJewelry,
	TOrderCreate,
	TOrderImageCreate,
	TStatus,
} from "@/types";
import { TOrderItemCreate } from "@/types/orderItemType";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { createOrderStore } from "../store";

const { Title } = Typography;
const schema = orderValidation.orderSchema.pick([
	"orderDate",
	"status",
	"customer",
	"orderItems",
	"totalPrice",
]);
export type TFormOrder = yup.InferType<
	yup.ObjectSchema<typeof schema>
>["__outputType"];
const initValues: TFormOrder = {
	orderDate: dayjs().toISOString(),
	status: TStatus.NEW,
	customer: { id: 0 },
	totalPrice: 0,
	orderItems: [
		{
			id: 0,
			quantity: 1,
			price: null,
			specialRequests: "Không",
			notes: "",
			project: null,
			jewelry: null,
			category: { id: 0 },
			material: { id: 0 },
			images: [],
		},
	],
};
type Props = {};

const CreateOrderBasicForm: React.FC<Props> = ({}) => {
	const [cartItemSession, setCartItemSession] = useState<
		TCartItemSession[] | null
	>(null);
	const { searchParams } = useRouterCustom();
	const account = useAccountStore((state) => state.account);
	const [images, setImages] = useState<UploadFile[] | null>(null);
	const next = createOrderStore((state) => state.next);
	const [products, setProducts] = useState<TJewelry[] | null>(null);
	const pId: string | null = searchParams.get("pId");
	const quantity: number =
		searchParams.get("quantity") === null
			? 1
			: Number.parseInt(searchParams?.get("quantity")!, 10);
	const methods = useForm<TFormOrder>({
		defaultValues: { ...initValues, customer: { id: account?.id } },
		resolver: yupResolver(schema),
		mode: "onChange",
	});
	const {
		setValue,
		handleSubmit,
		formState: { errors },
	} = methods;
	console.log("🚀 ~ errors:", errors);

	const message = App.useApp().message;
	useEffect(() => {
		if (account) {
			setValue("customer.id", account?.id!);
		}
	}, [account]);
	useEffect(() => {
		if (typeof window !== "undefined") {
			const productSession = window.sessionStorage.getItem(
				KEY_CONST.PLACE_ORDER_PRODUCT
			);
			if (productSession) {
				const products: TCartItemSession[] = JSON.parse(productSession);
				console.log("🚀 ~ useEffect ~ products:", products);

				const totalPrice = products?.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				);
				setValue("totalPrice", totalPrice);
				setValue(
					"orderItems",
					products.map((item) => ({
						id: item.id,
						jewelry: { id: item.id },
						product: { ...item, id: item.id },
						quantity: item.quantity,
						price: item.price,
						specialRequests: "Không",
						notes: "",
						project: null,
						material: null,
						category: null,
						images: [],
					}))
				);
				setCartItemSession(products);
			}
		}
	}, [setProducts, setValue, quantity]);

	const createOrder = (data: TFormOrder) => {
		const dataConvert: TOrderCreate = {
			...data,
			orderDate: dayjs(data.orderDate).toISOString(),
			customer: { id: data.customer.id },
		};
		console.log("🚀 ~ dataConvert:", dataConvert);
		return orderService.create(dataConvert);
	};

	const createOrderItem = async (data: TFormOrder, orderId: number) => {
		const { orderItems } = data;
		const dataConvert = orderItems.map(async (item, index) => {
			const { id, ...rest } = item;
			const newOrderItem = await orderItemService.create({
				...rest,

				order: { id: orderId },
			} as TOrderItemCreate);
			await uploadImages(newOrderItem.id, item?.images || []);
			return newOrderItem;
		});

		return Promise.all(dataConvert);
	};

	const uploadImages = async (orderItemId: number, images: UploadFile[]) => {
		if (images && images.length > 0) {
			const folder = supabaseService.createImagesFolder(
				"orders",
				orderItemId
			);
			const urls = await supabaseService.uploadMultiple(images, folder);
			if (urls) {
				const data: TOrderImageCreate[] = urls.map((url) => ({
					url: url,
					orderItem: { id: orderItemId },
				}));
				await orderImageService.createMultiple(data);
			}
		}
	};
	const createMutation = useMutation({
		mutationFn: async (data: TFormOrder) => {
			const order = await createOrder(data);
			return await Promise.all([await createOrderItem(data, order.id)]);
		},
		onSuccess: () => {
			message.success("Đã tạo đơn hàng thành công");
			next();
		},
		onError(error) {
			message.error("Tạo đơn hàng thất bại. Xin thử lại");
		},
	});
	const test = (data: TFormOrder) => {
		console.log("🚀 ~ test ~ data:", data);
		// createOrderItem(data, 1);
	};

	return (
		<Spin spinning={createMutation.isPending}>
			<FormProvider {...methods}>
				<Form
					layout="vertical"
					onFinish={handleSubmit(
						(data) => createMutation.mutate(data)
						// test(data)
					)}
					className="flex flex-col gap-4"
				>
					{account && <AccountDisplay account={account} />}
					<Row gutter={[16, 16]}>
						<Col span={16}>
							<OrderItemForm products={cartItemSession} />
						</Col>
						<Col span={8}>
							<Card>
								<Title level={4}>Chi tiết</Title>
								<div className="flex flex-col gap-2">
									<OrderDateInfo />
									<OrderDetailAction />
								</div>
							</Card>
						</Col>
					</Row>
				</Form>
			</FormProvider>
		</Spin>
	);
};

export default CreateOrderBasicForm;
