import { Drawer } from "antd";
import React from "react";

import categoryStore from "../store";
import CreateCategoryForm from "./CategoryForm";

const DrawerForm: React.FC<{}> = () => {
	const { openDrawer, setOpenDrawer } = categoryStore();
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
