"use client";
import { Divider, Drawer, Space } from "antd";
import React from "react";

import { templateStore } from "../store";
import AddTemplateForm from "./AddTemplateForm";
import AddTemplateStepForm from "./AddTemplateStepForm";
import UpdateTemplateForm from "./UpdateTemplateForm";
import UpdateTemplateStepFormList from "./UpdateTemplateStepFormList";

const DrawerForm: React.FC<{}> = () => {
	const {
		openDrawer,
		setToggleRefresh,
		templateCreate,
		templateUpdate,
		reset,
	} = templateStore();
	console.log("🚀 ~ templateCreate:", templateCreate);
	console.log("🚀 ~ templateUpdate:", templateUpdate);

	const render = () => {
		if (templateCreate)
			return (
				<Space direction="vertical" className="flex">
					<AddTemplateStepForm />
					<UpdateTemplateStepFormList />
				</Space>
			);
		if (templateUpdate) {
			return (
				<Space direction="vertical" className="flex">
					<UpdateTemplateForm />
					<Divider />
					<AddTemplateStepForm />
					<UpdateTemplateStepFormList />
				</Space>
			);
		}

		return <AddTemplateForm />;
	};

	return (
		<Drawer
			title="Tạo một phân loại mới"
			onClose={() => {
				reset();
				setToggleRefresh();
			}}
			open={openDrawer}
		>
			{render()}
		</Drawer>
	);
};

export default DrawerForm;
