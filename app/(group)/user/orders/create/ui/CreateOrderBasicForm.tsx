"use client";
import { App, Button, Form, Space, Spin, Tag } from 'antd';
import { UploadFile } from 'antd/lib';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useRouterCustom } from '@/hooks';
import { useAccountStore } from '@/providers';
import { jewelryService, orderImageService, orderService } from '@/services';
import supabaseService from '@/services/supabaseService';
import { LabelCustom } from '@/shared/FormCustom/InputCustom';
import { InputImage } from '@/shared/FormCustom/InputImage';
import { SelectMaterialForm } from '@/shared/FormSelect';
import { AccountDisplay } from '@/shared/FormSelect/AccountForm';
import { SelectCategoryForm } from '@/shared/FormSelect/SelectCategoryForm';
import { TOrderCreate, TOrderImageCreate, TStatus } from '@/types';
import orderValidation from '@/validations/orderValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createOrderStore } from '../store';
import ProductCard from './ProductCard';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const schema = orderValidation.orderSchema.pick([
	"orderDate",
	"specialRequests",
	"status",
	"customer",
	"jewelry",
	"category",
	"material",
]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValues: TForm = {
	orderDate: dayjs().toISOString(),
	specialRequests: "",
	status: TStatus.NEW,
	customer: { id: 0 },
	category: { id: 0 },
	material: { id: 0 },
	jewelry: { id: null },
};
type Props = {};

const CreateOrderBasicForm: React.FC<Props> = ({}) => {
	const { searchParams } = useRouterCustom();
	const account = useAccountStore((state) => state.account);
	const [images, setImages] = useState<UploadFile[] | null>(null);
	const next = createOrderStore((state) => state.next);
	const pId: string | null = searchParams.get("pId");
	const methods = useForm<TForm>({
		defaultValues: { ...initValues, customer: { id: account?.id } },
		resolver: yupResolver(schema),
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

	const createOrder = (data: TForm) => {
		const dataConvert: TOrderCreate = {
			...data,
			orderDate: dayjs(data.orderDate).toISOString(),
			customer: { id: data.customer.id },
			jewelry: pId ? { id: Number.parseInt(pId) } : null,
			material: data?.material?.id ? { id: data?.material?.id } : null,
			category: data?.category?.id ? { id: data?.category?.id } : null,
			totalPrice: getProduct?.data?.price,
		};
		console.log("🚀 ~ dataConvert:", dataConvert);
		return orderService.create(dataConvert);
	};
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
			setValue("category.id", getProduct.data.category.id);
		}
	}, [getProduct.data]);

	const handleOnChange = (
		newFileList: UploadFile[],
		file: UploadFile<any>
	) => {
		setImages(newFileList);
	};
	const uploadImages = async (orderId: number): Promise<string[] | null> => {
		if (images && images.length > 0) {
			const folder = supabaseService.createImagesFolder(
				"orders",
				orderId
			);
			return await supabaseService.uploadMultiple(images, folder);
		}
		return null;
	};
	const createOrerImages = async (orderId: number): Promise<void> => {
		const urls = await uploadImages(orderId);
		if (urls) {
			const data: TOrderImageCreate[] = urls.map((url) => ({
				url: url,
				order: { id: orderId },
			}));
			await orderImageService.createMultiple(data);
		}
	};
	const createMutation = useMutation({
		mutationFn: async (data: TForm) => {
			const order = await createOrder(data);
			await createOrerImages(order.id);
			return order;
		},
		onSuccess: () => {
			message.success("Đã tạo đơn hàng thành công");
			next();
		},
		onError(error) {
			message.error("Tạo đơn hàng thất bại. Xin thử lại");
		},
	});
	const renderForm = useMemo(() => {
		if (!getProduct.data) {
			return (
				<>
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
					<Space direction="vertical">
						<SelectMaterialForm
							status={
								errors.material?.message ||
								errors.material?.id?.message
									? "error"
									: ""
							}
							onChange={(value) =>
								setValue("material.id", value, {
									shouldValidate: true,
								})
							}
						/>
						<span className="text-red-500">
							{errors.material?.message ||
								errors.material?.id?.message}
						</span>
					</Space>
				</>
			);
		}
		return <></>;
	}, [getProduct.data, errors]);
	return (
		<Spin spinning={createMutation.isPending}>
			<FormProvider {...methods}>
				<Form
					layout="vertical"
					onFinish={handleSubmit((data) =>
						createMutation.mutate(data)
					)}
					className="flex flex-col gap-4"
				>
					{account && <AccountDisplay account={account} />}
					<div className="grid grid-cols-1 md:grid-cols-1  gap-4">
						<div className="flex flex-col gap-4">
							{renderForm}
							<Spin spinning={createMutation.isPending}>
								<Space direction="vertical" className="flex">
									<LabelCustom label="Cung cấp thêm hình ảnh" />
									<Tag className="text-wrap italic">
										Hình ảnh này giúp chúng tôi có thể tạo
										ra sản phẩm giống ý bạn hơn
									</Tag>
									<InputImage onChange={handleOnChange} />
								</Space>
							</Spin>
							<Space direction="vertical" className="flex">
								<LabelCustom
									label="Yêu cầu cụ thể"
									required={true}
								/>
								<ReactQuill
									onChange={(value) =>
										setValue("specialRequests", value)
									}
									placeholder='Nếu không có yêu cầu hãy ghi "Không"'
								/>
								{errors.specialRequests?.message && (
									<span className="text-red-500">
										{errors.specialRequests?.message}
									</span>
								)}
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
			</FormProvider>
		</Spin>
	);
};

export default CreateOrderBasicForm;
