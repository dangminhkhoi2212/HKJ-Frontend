"use client";
import { App, Button, Form, Modal, Space, Spin, Tag } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ProductCard from "@/app/(group)/user/products/ui/ProductCard";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { jewelryService, orderImageService, orderService } from "@/services";
import { EmptyCustom } from "@/shared/EmptyCustom";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { ImagePreview } from "@/shared/ImagePreview";
import { TAccountInfo, TOrder, TStatus } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";
import orderValidation from "@/validations/orderValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueries } from "@tanstack/react-query";

const { TStatusMapper } = tagMapperUtil;
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const schema = orderValidation.orderSchema.pick([
	"orderDate",
	"specialRequests",
	"status",
	"customer",
	"jewelry",
	"category",
	"totalPrice",
	"expectedDeliveryDate",
	"id",
]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	id: 0,
	orderDate: dayjs().toISOString(),
	specialRequests: "",
	status: TStatus.NEW,
	customer: { id: 0 },
	category: { id: 0 },
	jewelry: { id: null },
	totalPrice: 0,
	expectedDeliveryDate: dayjs().add(1, "day").toISOString(),
};
type Props = { id: string };

const { formatDate } = formatUtil;
const isActiveStatus = (status: TStatus): boolean => {
	return status === TStatus.NEW || status === TStatus.IN_PROCESS;
};
const Allow: React.FC<{ allow: boolean; status: TStatus }> = ({
	allow,
	status,
}) => {
	console.log("🚀 ~ allow:", allow);
	if (allow) return null;
	return (
		<div className="flex my-4">
			<Tag color="red" className="flex text-xl">
				Đơn hàng này đã &quot;{TStatusMapper(status)}&quot;, bạn không
				thể cập nhật
			</Tag>
		</div>
	);
};
const AllowMemo = memo(Allow);
const HandleOrder: React.FC<Props> = ({ id }) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [account, setAccount] = useState<TAccountInfo | null>(null);
	const [allow, setAllow] = useState<boolean>(() => true);
	const { router } = useRouterCustom();
	const {
		control,
		getValues,
		setValue,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<TForm>({
		resolver: yupResolver(schema),
	});
	console.log("🚀 ~ errors:", errors);

	const message = App.useApp().message;

	const [getOrder, getProduct, getOrderImages] = useQueries({
		queries: [
			{
				queryKey: ["order", id],
				queryFn: () => {
					return orderService.getOne(id);
				},
				enabled: !!id,
				refetchOnMount: true,
				staleTime: 0,
			},
			{
				queryKey: ["product", getValues("jewelry.id")],
				queryFn: () => {
					return jewelryService.getOne(getValues("jewelry.id")!);
				},
				enabled: !!getValues("jewelry.id"),
				refetchOnMount: true,
				staleTime: 0,
			},
			{
				queryKey: ["order-image", id],
				queryFn: () => {
					return orderImageService.get({
						orderId: { equals: id },
					});
				},
				enabled: !!id,
				refetchOnMount: true,
				staleTime: 0,
			},
		],
	});

	useEffect(() => {
		if (getOrder.data) {
			const data: TOrder = getOrder.data;
			const account = { ...data?.customer };
			reset({
				...getOrder.data,
				jewelry: { id: getOrder?.data?.jewelry?.id },
			});
			setAccount({
				...account,
				firstName: account?.user?.firstName!,
				lastName: account?.user?.lastName!,
				email: account?.user?.email!,
			});
			setAllow(isActiveStatus(data.status));
		}
	}, [getOrder.data, getOrder.refetch]);
	const updateOrder = useMutation({
		mutationFn: (data: TForm) => {
			console.log("🚀 ~ data:", data);

			return orderService.updatePartical({
				...data,
				jewelry: data?.jewelry?.id ? { id: data?.jewelry?.id! } : null,
			});
		},
		onSuccess: () => {
			message.success("Cập nhật đơn hàng thành công");
			router.push(routesManager.order);
		},
	});
	const handleCancel = useMutation({
		mutationFn: () => {
			return orderService.updatePartical({
				id: Number.parseInt(id),
				status: TStatus.CANCEL,
			});
		},
		onSuccess: () => {
			message.success("Đã hủy đơn hàng");
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	if (!getOrder.data) {
		return <EmptyCustom />;
	}
	return (
		<Spin
			spinning={
				getOrder.isLoading ||
				getProduct.isLoading ||
				getOrderImages.isLoading ||
				updateOrder.isPending ||
				handleCancel.isPending
			}
		>
			<AllowMemo allow={allow} status={getOrder.data?.status!} />
			<Modal
				title="Hủy đơn hàng"
				open={showModal}
				onCancel={() => setShowModal(false)}
				onOk={() => handleCancel.mutate()}
				okButtonProps={{
					danger: true,
					loading: handleCancel.isPending,
				}}
				cancelButtonProps={{
					disabled: handleCancel.isPending,
				}}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<p>Bạn có muốn hủy đơn hàng này?</p>
			</Modal>
			<Form
				layout="vertical"
				onFinish={handleSubmit((data) => updateOrder.mutate(data))}
				className="flex flex-col gap-4"
			>
				{account && <AccountDisplay account={account} />}

				<div className="grid grid-cols-1 md:grid-cols-2  gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex  flex-col items-start gap-4 ">
							<p className="text-xl font-semibold">
								Ngày đặt:{" "}
								{formatDate(getOrder?.data?.orderDate!)}
							</p>
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-2">
									<LabelCustom
										label="Ngày dự kiến giao"
										required
									/>
									<InputCustom
										control={control}
										placeholder={"Ngày dự kiến giao"}
										name="expectedDeliveryDate"
										type="date"
									/>
								</div>
							</div>
						</div>
						<InputCustom
							control={control}
							name="status"
							label="Trạng thái"
							type="select"
							options={Object.entries(TStatus).map(
								([key, value]) => ({
									label: TStatusMapper(value),
									value: key,
								})
							)}
							className="w-40"
						/>
						{getOrder?.data?.category?.id && (
							<Space direction="vertical">
								<SelectCategoryForm
									status={
										errors.category?.message ||
										errors.category?.id?.message
											? "error"
											: ""
									}
									value={getOrder.data?.category?.id}
									onChange={(value) =>
										setValue("category.id", value, {
											shouldValidate: true,
										})
									}
								/>
								<div>
									<InputNumberCustom
										control={control}
										name="totalPrice"
										label="Tổng tiền thanh toán"
										required
										placeholder="Tổng tiền"
									/>
									<NumberToWords
										number={watch("totalPrice")}
									/>
								</div>
								<span className="text-red-500">
									{errors.category?.message ||
										errors.category?.id?.message}
								</span>
							</Space>
						)}
						<Space direction="vertical" className="flex">
							<LabelCustom label="Cung cấp thêm hình ảnh" />
							<Tag className="text-wrap italic">
								Hình ảnh này giúp chúng tôi có thể tạo ra sản
								phẩm giống ý bạn hơn
							</Tag>
							<ImagePreview
								images={getOrderImages?.data?.map(
									(item) => item.url
								)}
							/>
						</Space>
					</div>
					<div>
						<Space direction="vertical" className="flex">
							<LabelCustom
								label="Yêu cầu cụ thể"
								required={true}
							/>
							<ReactQuill
								readOnly
								value={getValues("specialRequests")}
								onChange={(value) =>
									setValue("specialRequests", value)
								}
							/>
							{errors.specialRequests?.message && (
								<span className="text-red-500">
									{errors.specialRequests?.message}
								</span>
							)}
						</Space>
						{getProduct?.data! && (
							<ProductCard jewelry={getProduct?.data!} />
						)}
					</div>
				</div>

				{allow && (
					<div className="flex justify-end gap-4">
						<Button
							type="primary"
							danger
							onClick={() => setShowModal(true)}
							loading={handleCancel.isPending}
						>
							Hủy đơn hàng
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={updateOrder.isPending}
						>
							Cập nhật
						</Button>
					</div>
				)}
			</Form>
		</Spin>
	);
};

export default HandleOrder;
