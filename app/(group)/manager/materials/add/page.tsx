"use client";
import { Frame } from "@/shared/Frame";

import AddMaterialForm from "./ui/AddMaterialForm";

const AddMaterialPage: React.FC<{}> = () => {
	return (
		<Frame title="Thêm chất liệu làm trang sức">
			<AddMaterialForm />
		</Frame>
	);
};

export default AddMaterialPage;
