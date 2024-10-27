"use client";
import { Steps } from "antd";
import React from "react";

import { Frame } from "@/shared/Frame";

import { createOrderStore } from "../store";
import { CreateOrderBasicForm, CreateOrderImagesForm } from "./";
import CreateOrderResult from "./CreateOrderResult";

type Props = {};

const items = [
	{
		title: "Thông tin",
	},
	{
		title: "Hình ảnh",
	},
	{
		title: "Kết quả",
	},
];
const OrderProcessingForm: React.FC<Props> = ({}) => {
	const step = createOrderStore((state) => state.step);
	const forms = [
		{
			key: 1,
			children: <CreateOrderBasicForm />,
		},
		{
			key: 2,
			children: <CreateOrderImagesForm />,
		},
		{
			key: 3,
			children: <CreateOrderResult />,
		},
	];
	return (
		<Frame
			title="Đặt làm mẫu trang sức"
			classsName="bg-white flex flex-col gap-4 "
		>
			<Steps current={step} items={items} />

			{step < forms.length && forms[step].children}
		</Frame>
	);
};

export default OrderProcessingForm;
