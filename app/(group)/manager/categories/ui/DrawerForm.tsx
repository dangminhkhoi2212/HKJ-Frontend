"use client";
import { Drawer } from "antd";
import React from "react";

import { TCategory } from "@/types";

import categoryStore from "../store";
import CreateCategoryForm from "./CategoryForm";

const DrawerForm: React.FC<{}> = () => {
	const { openDrawer, setOpenDrawer, setCategoryUpdate, setCategoryDelete } =
		categoryStore();

	React.useEffect(() => {
		setCategoryUpdate({} as TCategory);
		setCategoryDelete({} as TCategory);
	}, [openDrawer]);

	return (
		<Drawer
			title="Tạo một phân loại mới"
			onClose={() => setOpenDrawer(false)}
			open={openDrawer}
		>
			<CreateCategoryForm />
		</Drawer>
	);
};

export default DrawerForm;
