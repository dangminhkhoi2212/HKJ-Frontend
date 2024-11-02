"use client";
import {
	App,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Modal,
	Row,
	Spin,
	Tag,
	Typography,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { jewelryService, orderImageService, orderService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { ImagePreview } from "@/shared/ImagePreview";
import { TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries } from "@tanstack/react-query";

import ProductCard from "../../../products/ui/ProductCard";
import { orderDatailStore } from "../store";

const { Title, Text } = Typography;
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const schema = orderValidation.orderSchema.pick([
	"orderDate",
	"specialRequests",
	"status",
	"customer",
	"jewelry",
	"category",
]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	orderDate: dayjs().toISOString(),
	specialRequests: "",
	status: TStatus.NEW,
	customer: { id: 0 },
	category: { id: 0 },
	jewelry: { id: null },
};
type Props = { id: string };
const allowCancel = (status: TStatus): boolean => {
	return status === TStatus.NEW;
};
const { formatDate } = formatUtil;
const CreateOrderBasicForm: React.FC<Props> = ({ id }) => {
	const { router } = useRouterCustom();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showModalRecive, setShowModalRecive] = useState<boolean>(false);
	const account = useAccountStore((state) => state.account);
	const setOrder = orderDatailStore((state) => state.setOrder);
	const next = orderDatailStore((state) => state.next);
	const {
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: { ...initValues, customer: { id: account?.id } },
		resolver: yupResolver(schema),
	});
	const message = App.useApp().message;

	useEffect(() => {
		if (account) {
			setValue("customer.id", account?.id!);
		}
	}, [account]);

	const [getProduct, getOrder, getOrderImages] = useQueries({
		queries: [
			{
				queryKey: ["product", watch("jewelry.id")],
				queryFn: () => jewelryService.getOne(watch("jewelry.id")!),
				enabled: !!watch("jewelry.id"),
				staleTime: 0,
			},
			{
				queryKey: ["order", id],
				queryFn: () => orderService.getOne(id),
				enabled: !!id,
				staleTime: 0,
			},
			{
				queryKey: ["order-image", id],
				queryFn: () =>
					orderImageService.get({
						orderId: { equals: id },
					}),
				enabled: !!id,
				staleTime: 0,
			},
		],
	});

	const handleCancel = useMutation({
		mutationFn: () =>
			orderService.updatePartical({
				id: Number.parseInt(id),
				status: TStatus.CANCEL,
			}),
		onSuccess: () => {
			message.success("Đã hủy đơn hàng");
			router.push(`${routesUser.order}?status=${TStatus.CANCEL}`);
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	const handleRevice = useMutation({
		mutationFn: () =>
			orderService.updatePartical({
				id: Number.parseInt(id),
				status: TStatus.DELIVERED,
				actualDeliveryDate: dayjs().toISOString(),
			}),
		onSuccess: () => {
			message.success("Đã nhận hàng");
			router.push(`${routesUser.order}?status=${TStatus.DELIVERED}`);
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	useEffect(() => {
		if (getOrder.data) {
			reset({
				...getOrder.data,
				jewelry: { id: getOrder?.data?.jewelry?.id },
			});
		}
	}, [getOrder.data, getOrder.refetch]);

	const RenderButton = useMemo(() => {
		switch (getOrder.data?.status) {
			case TStatus.NEW: {
				return (
					<Button
						type="primary"
						danger
						onClick={() => setShowModal(true)}
					>
						Hủy đơn hàng
					</Button>
				);
			}
			case TStatus.COMPLETED: {
				return (
					<Button
						type="primary"
						onClick={() => setShowModalRecive(true)}
					>
						Nhận hàng
					</Button>
				);
			}
			default: {
				return <></>;
			}
		}
	}, [getOrder.data?.status]);
	return (
		<Spin
			spinning={
				getOrder.isLoading ||
				getProduct.isLoading ||
				getOrderImages.isLoading
			}
		>
			<Modal
				title="Hủy đơn hàng"
				open={showModal}
				onCancel={() => setShowModal(false)}
				onOk={() => handleCancel.mutate()}
				okButtonProps={{
					danger: true,
					loading: handleCancel.isPending,
				}}
				cancelButtonProps={{ disabled: handleCancel.isPending }}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<p>Bạn có muốn hủy đơn hàng này?</p>
			</Modal>
			<Modal
				title="Nhận hàng"
				open={showModalRecive}
				onCancel={() => setShowModalRecive(false)}
				onOk={() => handleRevice.mutate()}
				okButtonProps={{
					loading: handleRevice.isPending,
				}}
				cancelButtonProps={{ disabled: handleRevice.isPending }}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<p>Xác nhận nhận hàng?</p>
			</Modal>
			<Form layout="vertical" className="flex flex-col gap-6">
				{account && <AccountDisplay account={account} />}
				<Row gutter={[16, 16]}>
					<Col span={16}>
						<Card className="">
							<div className="flex flex-col gap-2">
								<Title level={4}>Thông tin đơn hàng</Title>
								<p>Mã đơn hàng: {getOrder?.data?.id}</p>
								{getProduct?.data! && (
									<div className="flex flex-col gap-2">
										<LabelCustom label="Sản phẩm mẫu" />
										<ProductCard
											jewelry={getProduct?.data!}
										/>
									</div>
								)}
								<LabelCustom label="Trạng thái đơn hàng" />
								<div>
									{getOrder?.data?.status &&
										tagMapperUtil.TStatusColorMapper(
											getOrder?.data?.status
										)}
								</div>
								<Text type="secondary">
									Cửa hàng đã tiếp nhận đơn hàng của bạn và có
									thể liên lạc với bạn qua điện thoại hoặc
									Zalo để tư vấn.
								</Text>
								<Divider />
								{getOrder?.data?.category?.id && (
									<>
										<LabelCustom label="Loại trang sức" />
										<p>{getOrder.data?.category?.name}</p>
									</>
								)}
								<LabelCustom
									label="Yêu cầu cụ thể"
									required={false}
								/>
								<div
									dangerouslySetInnerHTML={{
										__html: watch("specialRequests"),
									}}
								/>
								<LabelCustom label="Cung cấp thêm hình ảnh" />
								<Tag className="text-wrap italic">
									Hình ảnh giúp chúng tôi tạo ra sản phẩm
									giống ý bạn hơn
								</Tag>
								<ImagePreview
									images={getOrderImages?.data?.map(
										(item) => item.url
									)}
								/>
							</div>
						</Card>
					</Col>
					<Col span={8}>
						<Card>
							<div className="flex flex-col gap-2">
								<Title level={4}>Chi tiết</Title>
								<p>
									Ngày đặt:{" "}
									{formatDate(getOrder?.data?.orderDate!, {
										removeTime: true,
									})}
								</p>
								<p>
									Ngày giao dự kiến:{" "}
									{getOrder?.data?.expectedDeliveryDate ? (
										formatDate(
											getOrder?.data
												?.expectedDeliveryDate!,
											{ removeTime: true }
										)
									) : (
										<Tag>Đang cập nhật</Tag>
									)}
								</p>
								<p>
									Tổng thanh toán:{" "}
									{getOrder?.data?.totalPrice ? (
										formatUtil.formatCurrency(
											getOrder?.data?.totalPrice
										)
									) : (
										<Tag>Đang cập nhật</Tag>
									)}
								</p>
								{RenderButton}
							</div>
						</Card>
					</Col>
				</Row>
			</Form>
		</Spin>
	);
};

export default CreateOrderBasicForm;
