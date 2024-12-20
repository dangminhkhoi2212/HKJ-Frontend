import { Card, InputNumber, Space, Tag, Typography } from "antd";
import { UploadFile } from "antd/lib";
import React, { useCallback, useMemo, useState } from "react";
import {
	Controller,
	useFieldArray,
	useFormContext,
	useWatch,
} from "react-hook-form";

import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import { SelectCategoryForm } from "@/shared/FormSelect";
import { TCartItemSession, TJewelry, TOrder, TStatus } from "@/types";

import { OrderProductCard } from "../CardCustom";
import { ImagePreview } from "../ImagePreview";
import OrderNoteForm from "./OrderNoteForm";
import OrderSpecialRequesteForm from "./OrderSpecialRequestForm";

type TRole = "user" | "manager";
const { Title } = Typography;
type Props = {
	products?: TCartItemSession[] | null;
	role?: TRole;
	currentOrder?: TOrder;
};
type TForm = {
	id?: number;
	orderItems: {
		quantity: number;
		price: number;
		specialRequests: string;
		notes: string;
		project: { id: number } | null;
		jewelry: { id: number } | null;
		category: { id: number } | null;
		// material: { id: number } | null;
		product: { id: number } | null;
		images: UploadFile[];
	}[];
	totalPrice: number;
	status: TStatus;
};
export const allowUserChange = (
	orderId: number,
	status: TStatus,
	role: TRole
) => !!(status === TStatus.NEW && !orderId && role === "user");
export const allowManagerChange = (
	orderId?: number,
	status?: TStatus,
	role: TRole = "manager"
) => {
	return !!(
		(status === TStatus.IN_PROCESS || status === TStatus.NEW) &&
		role === "manager" &&
		orderId
	);
};

const RenderImageForm: React.FC<{
	index: number;
	allowChangeForm: boolean;
	field: TForm["orderItems"][number];

	handleOnChange: (
		fileList: UploadFile[],
		file: UploadFile,
		index: number
	) => void;
}> = ({ index, allowChangeForm, handleOnChange, field }) => {
	if (allowChangeForm) {
		return (
			<InputImage
				onChange={(fileList, file) =>
					handleOnChange(fileList, file, index)
				}
				images={field?.images}
			/>
		);
	}
	if (!field?.images?.length) return "Không có ảnh ";
	return <ImagePreview images={field.images.map((item) => item.url!)} />;
};
const OrderItemForm: React.FC<Props> = ({
	products,
	role = "user",
	currentOrder,
}) => {
	const {
		control,
		setValue,
		formState: { errors },
		getValues,
	} = useFormContext<TForm>();

	const orderId: TForm["id"] = useWatch({
		control,
		name: "id",
	});
	const orderStatus: TForm["status"] = useWatch({
		control,
		name: "status",
	});
	const { fields, update, append, remove } = useFieldArray({
		control,
		name: "orderItems",
	});

	const [images, setImages] = useState<UploadFile[] | null>(null);
	const handleOnChangeImage = (
		newFileList: UploadFile[],
		file: UploadFile<any>,
		index: number
	) => {
		setImages(newFileList);
		setValue(`orderItems.${index}.images`, newFileList);
	};
	const allowManagerChangeForm = useMemo(
		() => allowManagerChange(currentOrder?.id, currentOrder?.status, role),
		[currentOrder?.id, currentOrder?.status, role, allowManagerChange]
	);
	const allowUserChangeForm = useMemo(
		() =>
			allowUserChange(
				currentOrder?.id!,
				currentOrder?.status ?? TStatus.NEW,
				role
			),
		[currentOrder?.id, currentOrder?.status, role, allowUserChange]
	);
	const handleChangeCategory = (
		index: number,
		value: number,
		field: TForm["orderItems"][number]
	) => {
		update(index, {
			...field,
			category: { id: value },
		});
	};
	// const handleChangeMaterial = (
	// 	index: number,
	// 	value: number,
	// 	field: TForm["orderItems"][number]
	// ) => {
	// 	update(index, {
	// 		...field,
	// 		material: { id: value },
	// 	});
	// };

	const renderOption = useCallback(
		(
			product: TCartItemSession,
			index: number,
			field: TForm["orderItems"][number]
		) => {
			if (field.product) {
				return (
					<OrderProductCard
						jewelry={field.product as unknown as TJewelry}
					/>
				);
			}
			return (
				<>
					<Space direction="vertical">
						<SelectCategoryForm
							value={field?.category?.id || null}
							status={
								errors?.orderItems?.[index]?.category?.id
									?.message
									? "error"
									: ""
							}
							onChange={(value) =>
								handleChangeCategory(index, value, field)
							}
							disabled={!allowUserChangeForm}
						/>
						<span className="text-red-500">
							{errors?.orderItems?.[index]?.category?.id?.message}
						</span>
					</Space>
					{/* <Space direction="vertical">
						<SelectMaterialForm
							value={field?.material?.id || null}
							status={
								errors?.orderItems?.[index]?.material?.id
									?.message
									? "error"
									: ""
							}
							onChange={(value) =>
								handleChangeMaterial(index, value, field)
							}
							disabled={!allowUserChangeForm}
						/>
						<span className="text-red-500">
							{errors?.orderItems?.[index]?.material?.id?.message}
						</span>
					</Space> */}
				</>
			);
		},
		[products, errors]
	);
	const handleOnChangeQuantity = (
		value: number | null,
		index: number,
		field: any
	) => {
		field.onChange(value);
		const orderProducts = getValues("orderItems");
		const totalPrice = orderProducts?.reduce((total, item, i) => {
			if (i == index) {
				return total + item.price * value!;
			} else {
				return total + item.price * item.quantity;
			}
		}, 0);
		setValue("totalPrice", totalPrice);
	};
	return (
		<div className="flex flex-col gap-4">
			{fields?.map((field, index) => (
				<Card
					className="grid grid-cols-1 md:grid-cols-1  gap-4"
					key={field.id}
				>
					<div className="flex flex-col gap-4">
						<Title level={4}>Thông tin</Title>
						{renderOption(products?.[index]!, index, field)}
						<Space direction="vertical">
							<LabelCustom label="Số lượng" required />
							<Controller
								name={`orderItems.${index}.quantity`}
								control={control}
								render={({ field }) => (
									<InputNumber
										min={1}
										max={20}
										size="large"
										defaultValue={1}
										{...field}
										onChange={(value) =>
											handleOnChangeQuantity(
												value,
												index,
												field
											)
										}
										disabled={!allowUserChangeForm}
									/>
								)}
							/>
						</Space>
						<Space direction="vertical" className="flex">
							<LabelCustom label="Cung cấp thêm hình ảnh" />
							{role === "user" && (
								<Tag className="text-wrap italic">
									Hình ảnh này giúp chúng tôi có thể tạo ra
									sản phẩm giống ý bạn hơn
								</Tag>
							)}
							<RenderImageForm
								allowChangeForm={allowUserChangeForm}
								index={index}
								field={field}
								handleOnChange={handleOnChangeImage}
							/>
						</Space>
						<OrderSpecialRequesteForm
							control={control}
							name={`orderItems.${index}.specialRequests`}
							disabled={!allowUserChangeForm}
							role={role}
						/>
						{orderId && (
							<OrderNoteForm
								control={control}
								role={role}
								name={`orderItems.${index}.notes`}
								disabled={!allowManagerChangeForm}
							/>
						)}
					</div>
				</Card>
			))}
		</div>
	);
};

export default OrderItemForm;
