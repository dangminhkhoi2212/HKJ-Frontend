"use client";
import { Space, Steps } from "antd";
import React, { useEffect } from "react";

import CreateProcessing from "../../update/[id]/ui/UpdateProcessing";
import { createProjectStore } from "../store";
import CreateBasic from "./CreateBasicProject";

type Props = {};
const items = [
	{
		title: "Thông tin",
	},
	{
		title: "Quy trình",
	},
];
const CreateProject: React.FC<Props> = ({}) => {
	const { step, reset } = createProjectStore();
	const forms = [
		{
			key: 1,
			children: <CreateBasic />,
		},
		{
			key: 2,
			children: <CreateProcessing />,
		},
	];

	useEffect(() => {
		return () => reset();
	}, []);
	return (
		<Space size={"large"} direction="vertical" className="flex">
			<Steps current={step} items={items} />
			{step < forms.length && forms[step].children}
		</Space>
	);
};

export default CreateProject;
