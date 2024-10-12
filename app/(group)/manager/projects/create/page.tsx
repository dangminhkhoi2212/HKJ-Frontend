import React from "react";

import { Frame } from "@/shared/Frame";

import { CreateBasic } from "./ui";

type Props = {};

const CreateProjectPage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Tạo dự án">
			<CreateBasic />
		</Frame>
	);
};

export default CreateProjectPage;
