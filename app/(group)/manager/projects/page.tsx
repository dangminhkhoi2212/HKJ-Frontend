import { Button } from "antd";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

import { QUERY_CONST } from "@/const";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import { Frame } from "@/shared/Frame";
import { QueryClient } from "@tanstack/react-query";

import { ProjectList } from "./ui";

const { defaultQuery } = QUERY_CONST;
type Props = {};

const ProjectPage: React.FC<Props> = async ({}) => {
	const queryClient = new QueryClient();

	await queryClient!.prefetchQuery({
		queryKey: ["posts"],
		queryFn: () => projectService.get(defaultQuery),
	});
	return (
		<Frame
			title="Dự án"
			discription={
				<span className="text-sm text-gray-500">
					Quản lí các quy trình sản xuất trang sức
				</span>
			}
			buttons={
				<Link href={routesManager.createProject}>
					<Button
						type="primary"
						className="shadow-md"
						icon={<Plus size={18} />}
					>
						Thêm dự án
					</Button>
				</Link>
			}
		>
			{/* <HydrationBoundary state={dehydrate(queryClient!)}> */}
			<ProjectList />
			{/* </HydrationBoundary> */}
		</Frame>
	);
};

export default ProjectPage;
