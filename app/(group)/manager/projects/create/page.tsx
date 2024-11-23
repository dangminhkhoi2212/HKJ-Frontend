import React from "react";

import { Frame } from "@/shared/Frame";

import { CreateBasic } from "./ui";

type Props = {};

const CreateProjectPage: React.FC<Props> = ({}) => {
	return (
		<Frame
			title="Tạo dự án"
			discription="Với mỗi đơn hàng sẽ cho một dự án riêng biệt. Giúp quản lý tiến độ chế tác trang sức."
		>
			<CreateBasic />
		</Frame>
	);
};

export default CreateProjectPage;
