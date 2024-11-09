"use client";
import { Space, Steps } from "antd";
import React, { useEffect } from "react";

import { createJewelryStore } from "../store";
import CreateImageForm from "./CreateImagesForm";
import CreateJewelryProject from "./CreateJeweleryProjectForm";
import CreateBasicForm from "./CreateJewelryBasicForm";

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
type Props = {};
const CreateJewelryForm: React.FC<Props> = () => {
	const { step, reset } = createJewelryStore();

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	const forms = [
		{
			key: "1",
			children: <CreateBasicForm />,
		},
		{
			key: "2",
			children: <CreateImageForm />,
		},
		{
			key: "3",
			children: <CreateJewelryProject />,
		},
	];
	return (
		<Space direction="vertical" className="flex" size={"large"}>
			<Steps current={step} items={items} />
			{step < forms.length && forms[step].children}
		</Space>
	);
};

export default CreateJewelryForm;
