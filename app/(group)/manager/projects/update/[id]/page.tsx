"use client";
import React from "react";

import projectService from "@/services/projectService";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Tabs } from "./ui";

type Props = {
	params: {
		id: string;
		tab?: number;
	};
};
const hydrate = async (id: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["project", id],
		queryFn: () => projectService.getOne(Number.parseInt(id)!),
	});
	return dehydrate(queryClient);
};
const UpdateProject: React.FC<Props> = ({ params: { id } }) => {
	return (
		<Frame title="Cập nhật dự án">
			<HydrationBoundary state={hydrate(id)}>
				<Tabs />
			</HydrationBoundary>
		</Frame>
	);
};

export default UpdateProject;
