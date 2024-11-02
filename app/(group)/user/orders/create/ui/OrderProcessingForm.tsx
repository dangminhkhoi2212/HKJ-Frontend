"use client";
import { Steps } from "antd";
import React, { useEffect } from "react";

import { Frame } from "@/shared/Frame";

import { createOrderStore } from "../store";
import { CreateOrderBasicForm } from "./";
import CreateOrderResult from "./CreateOrderResult";

type Props = {};

const items = [
	{
		title: "Thông tin",
	},
	{
		title: "Kết quả",
	},
];
const OrderProcessingForm: React.FC<Props> = ({}) => {
	const step = createOrderStore((state) => state.step);
	const resetStore = createOrderStore((state) => state.reset);
	const forms = [
		{
			key: 1,
			children: <CreateOrderBasicForm />,
		},

		{
			key: 2,
			children: <CreateOrderResult />,
		},
	];
	useEffect(() => {
		return () => {
			resetStore();
		};
	}, []);
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
