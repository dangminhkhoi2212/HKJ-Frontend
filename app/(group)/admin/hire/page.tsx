"use client";
import { Divider } from "antd";
import React from "react";

import { Frame } from "@/shared/Frame";

import HireEmployeeForm from "./ui/HireEmployeeForm";
import ListHire from "./ui/ListHire";

const HirePage: React.FC<{}> = () => {
	return (
		<div className="grid grid-cols-1 gap-4">
			<Frame title="Cập nhật thông tin thuê nhân viên">
				<HireEmployeeForm />
			</Frame>
			<Divider />
			<ListHire />
		</div>
	);
};

export default HirePage;
