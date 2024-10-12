"use client";
import React, { useEffect } from "react";
import { useQuery } from "react-query";

import { useRouterCustom } from "@/hooks";
import projectService from "@/services/projectService";
import { Frame } from "@/shared/Frame";
import { TProject } from "@/types";

import { updateProjectStore } from "./store";
import { Tabs } from "./ui";

type Props = {
	params: {
		id: string;
		tab?: number;
	};
};

const UpdateProject: React.FC<Props> = ({ params: { id } }) => {
	const { setProjectId, setProject, setTab, reset, setIsLoading } =
		updateProjectStore();
	const { searchParams } = useRouterCustom();
	useEffect(() => {
		if (searchParams.get("tab"))
			setTab(Number.parseInt(searchParams.get("tab")!));
		setProjectId(Number.parseInt(id)!);
		return () => reset();
	}, []);
	const {} = useQuery({
		queryKey: ["project", id],
		queryFn: () => projectService.getOne(Number.parseInt(id)!),
		onSuccess(data: TProject) {
			setProject(data);
		},
		onSettled() {
			setIsLoading(false);
		},
	});
	return (
		<Frame title="Cập nhật dự án">
			<Tabs />
		</Frame>
	);
};

export default UpdateProject;
