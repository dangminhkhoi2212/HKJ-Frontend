import { Button, Space, Tag } from "antd";
import { Palette, Weight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { formatUtil } from "@/utils";

import { productDetailStore } from "../store";
import ProductImages from "./ProductImages";

type Props = {};

const ProductInfo: React.FC<Props> = ({}) => {
	const jewelry = productDetailStore((state) => state.jewelry);
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
				<Space className="">
					<Weight />
					{jewelry?.weight} Gram
				</Space>
				<Space>
					<Palette />
					<p>{jewelry?.color}</p>
				</Space>
				<div>
					<Tag className="text-2xl" color="red">
						{formatUtil.formatCurrency(jewelry?.price!)}
					</Tag>
				</div>

				<Link
					href={routesUser.createOrder(jewelry?.id)}
					className="w-full"
				>
					<Button type="primary" size="large" className={"w-full"}>
						Đặt mẫu này
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ProductInfo;
