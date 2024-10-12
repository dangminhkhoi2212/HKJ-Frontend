"use client";
import { Button } from "antd";
import { Plus } from "lucide-react";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { Frame } from "@/shared/Frame";

import { ProjectList } from "./ui";

type Props = {};

const ProjectPage: React.FC<Props> = ({}) => {
	const { router } = useRouterCustom();
	return (
		<Frame
			title="Dự án"
			discription={
				<span className="text-sm text-gray-500">
					Quản lí các quy trình sản xuât trang xuất
				</span>
			}
			buttons={
				<Button
					type="primary"
					className="shadow-md"
					icon={<Plus size={18} />}
					onClick={() => router.push(routesManager.createProject)}
				>
					Thêm dự án
				</Button>
			}
		>
			<ProjectList />
		</Frame>
	);
};

export default ProjectPage;
