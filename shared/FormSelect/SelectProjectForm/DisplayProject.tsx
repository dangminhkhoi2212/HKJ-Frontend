import { Descriptions, Space } from "antd";
import { DescriptionsProps } from "antd/lib";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { TProject } from "@/types";
import { formatUtil } from "@/utils";

type Props = {
	project: TProject;
};
const DisplayProject: React.FC<Props> = ({ project }) => {
	const items: DescriptionsProps["items"] = [
		{
			key: uuidv4(),
			label: "Mã dự án",
			children: project?.id,
			span: 1,
		},
		{
			key: uuidv4(),
			label: "Dự án",
			children: project?.name,
			span: 1,
		},

		{
			key: uuidv4(),
			label: "Ngày thực hiện",
			children: formatUtil.formatDate(project?.startDate, {
				removeTime: true,
			}),
			span: 1,
		},
		{
			key: uuidv4(),
			label: "Ngày hoàn thành",
			children: formatUtil.formatDate(project?.endDate, {
				removeTime: true,
			}),
			span: 1,
		},
		{
			key: uuidv4(),
			label: "Quản lí dự án",
			children: (
				<Space direction="vertical">
					<span>
						{project?.manager?.user?.firstName +
							" " +
							project?.manager?.user?.lastName}
					</span>
					<span>{project?.manager?.phone}</span>
				</Space>
			),
			span: 1,
		},
	];
	return (
		<Descriptions
			layout="vertical"
			bordered
			items={items}
			className="w-full"
			column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
		/>
	);
};

export default DisplayProject;
