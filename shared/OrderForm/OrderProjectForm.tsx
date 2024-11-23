"use client";
import { App, Card, Empty, Skeleton, Space, Spin, Switch } from "antd";
import dayjs from "dayjs";
import { Gantt, Task } from "gantt-task-react";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import MapAnotations from "@/shared/Anotation/MapAnotation";
import DisplayProject from "@/shared/FormSelect/SelectProjectForm/DisplayProject";
import SelectProjectForm from "@/shared/FormSelect/SelectProjectForm/SelectProjectForm";
import { TProject, TTask } from "@/types";
import { tagMapperUtil } from "@/utils";
import { useQuery } from "@tanstack/react-query";

import { GantTaskTooltipCustom } from "../GanttTaskCustom";

const { colorPriority } = tagMapperUtil;
type TProps = { role: "manager" | "user" };
type TForm = {
	id: number;
	project: { id: number };
};

const OrderProjectForm: React.FC<TProps> = ({ role }) => {
	const { setValue, getValues } = useFormContext();
	const [project, setProject] = useState<TProject | null>(null);
	const [tasksGantt, setTasksGantt] = useState<Task[]>([]);
	const [showList] = useState(true);
	const projectId = useMemo(() => {
		return getValues("project.id");
	}, [getValues("project.id")]);
	const [switchProject, setSwitchProject] = useState<boolean>(false);

	const message = App.useApp().message;
	const {
		data: tasks,
		refetch: getTasks,
		isSuccess: isTasksSuccess,
		isFetching: isTasksFetching,
		isPending: isTasksPending,
	} = useQuery({
		queryKey: ["tasks", project?.id],
		queryFn: () => taskService.get({ projectId: { equals: project?.id! } }),
		enabled: !!project?.id,
	});
	// console.log("tasks", { isTasksFetching, isTasksPending });
	console.log("tasksGantt", tasksGantt);
	const {
		data: projectApi,
		refetch: getProject,
		isSuccess: isProjectSuccess,
		isFetching: isProjectFetching,
	} = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => projectService.getOne(projectId),
		enabled: !project && !!projectId,
	});
	// console.log("project", { isProjectFetching, isProjectPending });

	useEffect(() => {
		if (isProjectSuccess) {
			setProject(projectApi!);
			getTasks();
		}
	}, [projectApi]);

	useEffect(() => {
		if (isTasksSuccess && project) {
			const tasksChart: Task[] = [
				{
					start: dayjs(project.startDate).toDate(),
					end: dayjs(project.endDate).toDate(),
					name: `DA: ${project.name}`,
					project: project.name,
					id: project.id.toString(),
					type: "project",
					progress: 100,
					isDisabled: false,
					styles: { progressColor: colorPriority(project.priority!) },
				},
				...tasks?.map((task: TTask) => ({
					start: dayjs(task.assignedDate!).toDate(),
					end: dayjs(task.expectDate).toDate(),
					name: `CĐ: ${task.name}`,
					project: task.name,
					id: task.id.toString(),
					type: "task" as const,
					progress: 100,
					isDisabled: false,
					styles: { progressColor: colorPriority(task.priority!) },
				})),
			];
			setTasksGantt(tasksChart);
		}
	}, [tasks, project, isTasksSuccess]);

	const renderGantt = useMemo(() => {
		const isLoading = isTasksPending;
		if (!project) return <Empty description="Không tìm thấy" />;
		if (isLoading) return <Skeleton active loading={isLoading} />;
		if (tasksGantt.length) {
			return (
				<Gantt
					tasks={tasksGantt}
					locale="vi"
					headerHeight={60}
					columnWidth={60}
					listCellWidth={switchProject ? "155px" : ""}
					TooltipContent={({ task }) => (
						<GantTaskTooltipCustom task={task} />
					)}
				/>
			);
		}
		return <Empty description="Chưa có dữ liệu" />;
	}, [tasksGantt, showList, switchProject]);

	const handleSelectProject = (data: TProject | null) => {
		setProject(data);
		if (!data) {
			setTasksGantt([]);
			setValue("project", null, { shouldValidate: true });
			return;
		}
		setValue("project.id", data?.id!, { shouldValidate: true });
	};

	return (
		<Spin spinning={isProjectFetching || isTasksFetching}>
			<Card>
				<Space direction="vertical" className="flex ">
					<SelectProjectForm onChange={handleSelectProject} />
					{project && <DisplayProject project={project} />}
					<Space>
						<MapAnotations />
						<Switch
							checked={switchProject}
							onChange={(value) => setSwitchProject(value)}
							title="Danh sách"
						/>
						<span>Danh sách</span>
					</Space>
					{renderGantt}
				</Space>
			</Card>
		</Spin>
	);
};

export default OrderProjectForm;
