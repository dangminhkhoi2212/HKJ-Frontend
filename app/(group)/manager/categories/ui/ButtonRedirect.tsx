"use client";
import { Button } from "antd";
import { Plus } from "lucide-react";
import React from "react";

import categoryStore from "../store";

type Props = {};

const ButtonRedirect: React.FC<Props> = ({}) => {
	const { setOpenDrawer } = categoryStore();
	return (
		<Button
			type="primary"
			className="shadow-md"
			icon={<Plus size={18} />}
			onClick={() => setOpenDrawer(true)}
		>
			Tạo phân loại
		</Button>
	);
};

export default ButtonRedirect;
