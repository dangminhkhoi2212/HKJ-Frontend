"use client";
import { App, Button, InputNumber, Space, Tag } from "antd";
import { CreditCard, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routesUser } from "@/routes";
import { cartService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { formatUtil } from "@/utils";
import { useMutation } from "@tanstack/react-query";

import { cartStore } from "../../../cart/store";
import { productDetailStore } from "../store";
import ProductImages from "./ProductImages";

type Props = {};

const ProductInfo: React.FC<Props> = ({}) => {
	const setForceRefresh = cartStore((state) => state.setForceRefresh);
	const reset = cartStore((state) => state.reset);
	const [quantity, setQuantity] = useState<number>(0);
	const jewelry = productDetailStore((state) => state.jewelry);
	const account = useAccountStore((state) => state.account);
	const message = App.useApp().message;
	const router = useRouterCustom().router;

	const addCart = async () => {
		const existedCartList = await cartService.get({
			customerId: { equals: account?.id },
			productId: { equals: jewelry?.id },
			isDeleted: { equals: false },
		});
		const existedCart = existedCartList[0];

		if (existedCart) {
			await cartService.updatePartical({
				id: existedCart.id,
				quantity: existedCart.quantity + quantity,
			});
		} else
			await cartService.create({
				quantity: quantity,
				customer: { id: account?.id! },
				product: { id: jewelry?.id! },
			});
	};
	const handleAddCart = useMutation({
		mutationFn: async () => {
			if (quantity === 0) {
				message.error("Vui nhập số lượng");
				throw new Error(KEY_CONST.ERROR_MESSAGE);
			}
			return await addCart();
		},
		onSuccess(data, variables, context) {
			message.success("Đã thêm vào giỏ hàng");
			setForceRefresh(true);
			router.push(routesUser.cart);
		},
		onError(error, variables, context) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	const handlePlace = () => {
		if (typeof window === undefined) {
			return;
		}

		const data = JSON.stringify([
			{
				...jewelry,
			},
		]);
		window.sessionStorage.setItem(KEY_CONST.PLACE_ORDER_PRODUCT, data);
	};
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	return (
		<div className="flex flex-col gap-4 p-5">
			<div className="flex flex-col gap-4">
				<LabelCustom label="Hình ảnh khác" />
				<ProductImages />
			</div>
			<div className="flex flex-col gap-4">
				<p className="text-sm text-gray-500">
					Mã sản phẩm: {jewelry?.id}
				</p>
				<p className="font-semibold italic text-2xl">{jewelry?.name}</p>
				{/* <Space className="">
					{jewelry?.materials?.map((item, index) => (
						<Tag key={index} color="blue">
							{item.material.name}
						</Tag>
					))}
				</Space> */}
				<div>
					<Tag className="text-2xl" color="red">
						{formatUtil.formatCurrency(jewelry?.price!)}
					</Tag>
				</div>
				<Space direction="vertical">
					<LabelCustom label="Số lượng" />
					<InputNumber
						min={1}
						max={20}
						size="large"
						defaultValue={1}
						value={quantity}
						onChange={(value) => setQuantity(value || 0)}
					/>
				</Space>

				<div className="grid grid-cols-2  gap-4">
					<Button
						type="default"
						size="large"
						icon={<ShoppingCart size={18} />}
						onClick={() => {
							handleAddCart.mutate();
						}}
					>
						Thêm vào giỏ hàng
					</Button>

					<div className="col-span-1 flex">
						<Button
							type="primary"
							size="large"
							icon={<CreditCard size={18} />}
							className="w-full"
							onClick={() => handlePlace()}
						>
							Đặt ngay
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
