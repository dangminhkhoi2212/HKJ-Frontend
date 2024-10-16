"use client";
import { Button } from "antd";
import { Plus } from "lucide-react";
import React from "react";

import { templateStore } from "../store";

type Props = {};

const ButtonDrawer: React.FC<Props> = ({}) => {
	const { setOpenDrawer } = templateStore();
	return (
		<Button
			type="primary"
			onClick={() => setOpenDrawer(true)}
			icon={<Plus size={18} />}
		>
			Tạo bản mẫu
		</Button>
	);
};

export default ButtonDrawer;
