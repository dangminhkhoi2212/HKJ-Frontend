"use client";
import { App, Card, Col, Form, Row, Spin, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { orderImageService, orderService } from "@/services";
import orderItemService from "@/services/orderItemService";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import {
	OrderDateInfo,
	OrderItemForm,
	OrderTotalPrice,
} from "@/shared/OrderForm";
import OrderDetailAction from "@/shared/OrderForm/OrderDetailAction";
import { TOrderItem, TStatus } from "@/types";
import { imageUtil } from "@/utils";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";

const { defaultQuery } = QUERY_CONST;
const schema = orderValidation.orderSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	id: 0,
	orderDate: dayjs().toISOString(),
	expectedDeliveryDate: dayjs().toISOString(),
	actualDeliveryDate: dayjs().toISOString(),
	status: TStatus.NEW,
	totalPrice: null,
	customer: { id: 0 },
	project: null,
	orderItems: [
		{
			id: 0,
			jewelry: null,
			quantity: 1,
			price: null,
			specialRequests: "",
			notes: "",
			category: { id: 0 },
		},
	],
};
type Props = { id: string };

const { convertToUploadFile } = imageUtil;
const { Title } = Typography;
const CreateOrderBasicForm: React.FC<Props> = ({ id }) => {
	const { router } = useRouterCustom();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showModalRecive, setShowModalRecive] = useState<boolean>(false);
	const account = useAccountStore((state) => state.account);
	const methods = useForm<TForm>({
		defaultValues: { ...initValues, customer: { id: account?.id } },
		resolver: yupResolver(schema),
	});
	const {
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useMemo(() => methods, [methods]);
	const message = App.useApp().message;

	useEffect(() => {
		if (account) {
			setValue("customer.id", account?.id!);
		}
	}, [account]);
	const getOrder = useQuery({
		queryKey: ["order", id],
		queryFn: () => orderService.getOne(id),
		enabled: !!id,
		staleTime: 0,
	});

	const getOrderItems = async () => {
		try {
			const orderItems = await orderItemService.get({
				...defaultQuery,
				orderId: { equals: id },
			});

			const orderItemsWithImages = orderItems.map(async (orderItem) => {
				return {
					...orderItem,
					images: await orderImageService.get({
						...defaultQuery,
						orderItemId: { equals: orderItem.id },
					}),
				};
			});
			const orderItemsWithImagesResolved: TOrderItem[] =
				await Promise.all(orderItemsWithImages);
			return orderItemsWithImagesResolved;
		} catch (error) {
			console.log("🚀 ~ getOrderItems ~ error:", error);
			message.error("Không thể lấy dữ liệu của đơn hàng");
		}
	};
	const { data: orderItems, isFetching: isFetchingOrderItems } = useQuery({
		queryKey: ["order-items", id],
		queryFn: () => getOrderItems(),
		enabled: !!id,
		staleTime: 0,
	});
	console.log("🚀 ~ orderItems:", orderItems);

	useEffect(() => {
		if (orderItems) {
			reset({
				...getOrder.data,
				orderItems: orderItems.map((item) => ({
					...item,
					id: item?.id!,
					material: item?.material?.id
						? { id: item?.material?.id }
						: null,
					category: item?.category?.id
						? { id: item?.category?.id }
						: null,
					project: item?.project?.id
						? { id: item?.project?.id }
						: null,
					jewelry: item?.jewelry?.id
						? { id: item?.jewelry?.id }
						: null,
					images:
						item?.images?.map((image) =>
							convertToUploadFile(image)
						) || [],
				})),
			});
		}
	}, [orderItems]);

	return (
		<Spin
			spinning={
				getOrder.isLoading ||
				isFetchingOrderItems ||
				getOrder.isFetching
			}
		>
			<FormProvider {...methods}>
				<Form layout="vertical" className="flex flex-col gap-6">
					{account && <AccountDisplay account={account} />}
					<Row gutter={[16, 16]}>
						<Col span={16}>
							<OrderItemForm />
						</Col>
						<Col span={8}>
							<Card>
								<Title level={4}>Chi tiết</Title>
								<div className="flex flex-col gap-2">
									<p>Mã đơn hàng: {id}</p>
									<OrderDateInfo />
									<OrderTotalPrice role="user" />
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
