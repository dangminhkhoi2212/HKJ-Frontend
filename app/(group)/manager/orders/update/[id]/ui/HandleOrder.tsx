"use client";
import { App, Card, Col, Form, Row, Spin, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST, QUERY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { orderImageService, orderService } from "@/services";
import notificationService from "@/services/notificationService";
import orderItemService from "@/services/orderItemService";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import {
	allowManagerChange,
	OrderDateInfo,
	OrderItemForm,
	OrderProject,
	OrderTotalPrice,
} from "@/shared/OrderForm";
import OrderDetailAction from "@/shared/OrderForm/OrderDetailAction";
import { TAccountInfo, TOrder, TOrderItem, TStatus } from "@/types";
import { TNotificationIcon } from "@/types/notificationIcon";
import { NotificationType } from "@/types/notificationType";
import { imageUtil } from "@/utils";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

const { Paragraph } = Typography;
const { defaultQuery } = QUERY_CONST;
const schema = orderValidation.orderSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	id: 0,
	orderDate: dayjs().toISOString(),
	expectedDeliveryDate: dayjs().toISOString(),
	status: TStatus.NEW,
	totalPrice: 0,
	actualDeliveryDate: "",
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
			// material: { id: 0 },
		},
	],
};
type Props = { id: string };

const { convertToUploadFile } = imageUtil;
const { Title } = Typography;
const createNotification = (
	accountId: number,
	customerId: number,
	icon: TNotificationIcon,
	orderId: number | string,
	content: string
) => {
	notificationService.createNotification({
		content,
		sender_id: accountId,
		receiver_id: customerId,
		icon: icon,
		type: NotificationType.USER,
		url: routesUser.orderDetail(orderId),
	});
};
const CreateOrderBasicForm: React.FC<Props> = ({ id }) => {
	const { router } = useRouterCustom();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [status, setStatus] = useState<TStatus>();
	console.log("🚀 ~ status:", status);
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
		setError,
		formState: { errors },
	} = useMemo(() => methods, [methods]);
	const message = App.useApp().message;

	console.log("🚀 ~ errors:", errors);
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
	const allowChangeForm = useMemo(() => {
		if (!getOrder.data) return false;
		const data = getOrder.data;
		setStatus(data.status);
		return allowManagerChange(data.id, data.status, "manager");
	}, [getOrder.data, allowManagerChange]);

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
	const updateOrderItems = async (data: TForm) => {
		return data.orderItems?.map((item) => {
			return orderItemService.updatePartical({
				id: item?.id! as number,
				notes: item?.notes!,
			});
		});
	};
	const updateMutation = useMutation({
		mutationFn: async (data: TForm) => {
			const [_, order] = await Promise.all([
				updateOrderItems(data),
				orderService.updatePartical({
					id: data?.id,
					status: data.status,
					expectedDeliveryDate: data.expectedDeliveryDate,
					project: data?.project?.id ? { id: data.project.id } : null,
					totalPrice: data?.totalPrice ?? null,
				}),
			]);
			return order;
		},
		onSuccess: (data: TOrder) => {
			if (status !== data.status) {
				if (data.status === TStatus.IN_PROCESS) {
					createNotification(
						account?.id!,
						data?.customer?.id!,
						TNotificationIcon.IN_PROCESS,
						data.id,
						`Đơn hàng ${data.id} của bạn đang được xử lý.`
					);
				} else if (data.status === TStatus.COMPLETED) {
					createNotification(
						account?.id!,
						data.customer.id!,
						TNotificationIcon.COMPLETED,
						data.id,
						`Đơn hàng ${data.id} của bạn đã hoàn thành. Bạn có thể đến cửa hàng để nhận.`
					);
				} else if (data.status === TStatus.CANCEL) {
					createNotification(
						account?.id!,
						data?.customer?.id!,
						TNotificationIcon.CANCEL,
						data.id,
						`Đơn hàng ${data.id} của bạn đã bị hủy.`
					);
				}
			}
			setStatus(data.status);
			message.success("Đã cập nhật đơn hàng thành công");
		},
		onError(error) {
			message.error("Cập nhật hàng thất bại. Xin thử lại");
		},
	});
	const test = (data: TForm) => {
		createNotification(
			account?.id!,
			data.customer.id!,
			TNotificationIcon.COMPLETED,
			data.id,
			`Đơn hàng ${data.id} của bạn đã hoàn thành. Bạn có thể đến cửa hàng để nhận.`
		);
	};
	return (
		<Spin
			spinning={
				getOrder.isLoading ||
				isFetchingOrderItems ||
				getOrder.isFetching ||
				updateMutation.isPending
			}
		>
			<FormProvider {...methods}>
				<Form
					layout="vertical"
					className="flex flex-col gap-6"
					onFinish={handleSubmit((data) => {
						if (!data.totalPrice) {
							setError("totalPrice", {
								type: "required",
								message: KEY_CONST.REQUIRED_NUMBER_FIELD,
							});
						} else updateMutation.mutate(data);
						// test(data);
					})}
				>
					{getOrder?.data?.customer && (
						<AccountDisplay
							account={
								{
									...getOrder?.data?.customer,
									firstName:
										getOrder?.data?.customer?.user
											?.firstName,
									lastName:
										getOrder?.data?.customer?.user
											?.lastName,
									email: getOrder?.data?.customer?.user
										?.email,
								} as TAccountInfo
							}
						/>
					)}
					<Row gutter={[16, 16]}>
						<Col span={16} className="flex flex-col gap-4">
							<OrderProject role="manager" />
							<OrderItemForm role="manager" />
						</Col>
						<Col span={8}>
							<Card>
								<Title level={4}>Chi tiết</Title>
								<div className="flex flex-col gap-2">
									<Paragraph
										className="m-0"
										copyable={{
											text: id,
										}}
									>
										Mã đơn hàng: {id}
									</Paragraph>
									<OrderDateInfo
										allowManagerChange={allowChangeForm}
									/>
									<OrderTotalPrice role="manager" />
									<OrderDetailAction role="manager" />
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
