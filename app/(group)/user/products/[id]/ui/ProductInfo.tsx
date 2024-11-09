import { Button, InputNumber, Space, Tag } from "antd";
import { Receipt, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { routesUser } from "@/routes";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { formatUtil } from "@/utils";

import { productDetailStore } from "../store";
import ProductImages from "./ProductImages";

type Props = {};

const ProductInfo: React.FC<Props> = ({}) => {
	const [quantity, setQuantity] = useState<number>(0);
	const jewelry = productDetailStore((state) => state.jewelry);

	// const handleAddCart = useMutation({
	//     mutationFn: () => {
	//         return cartService.create({
	//             quantity: quantity,
	//         });
	//     },
	// })
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
						max={10}
						size="large"
						defaultValue={0}
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
							// handleAddCart()
						}}
					>
						Thêm vào giỏ hàng
					</Button>

					<div className="col-span-1 flex">
						<Link
							href={routesUser.createOrder(jewelry?.id)}
							className="w-full"
						>
							<Button
								type="primary"
								size="large"
								icon={<Receipt size={18} />}
								className="w-full"
							>
								Đặt ngay
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
