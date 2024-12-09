"use client";
import { App, Card, Empty, Skeleton, Space, Spin, Switch } from "antd";
import dayjs from "dayjs";
import { Gantt, Task } from "gantt-task-react";
import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { COLORS_CONST } from "@/const";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import MapAnotations from "@/shared/Anotation/MapAnotation";
import DisplayProject from "@/shared/FormSelect/SelectProjectForm/DisplayProject";
import SelectProjectForm from "@/shared/FormSelect/SelectProjectForm/SelectProjectForm";
import { TProject, TStatus, TTask } from "@/types";
import { tagMapperUtil } from "@/utils";
import queryClientUtil from "@/utils/queryClientUtil";
import { useQuery } from "@tanstack/react-query";

import { GantTaskTooltipCustom } from "../GanttTaskCustom";

const { colorPriority } = tagMapperUtil;
type TProps = { role: "manager" | "user" };
type TForm = {
	id: number;
	project: { id: number };
	status: TStatus;
};

const queryClient = queryClientUtil.getQueryClient();
const { COMPLETED_TASK_COLOR } = COLORS_CONST;
const OrderProjectForm: React.FC<TProps> = ({ role }) => {
	const {
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext<TForm>();
	const [project, setProject] = useState<TProject | null>(null);
	const [tasksGantt, setTasksGantt] = useState<Task[]>([]);
	const [showList] = useState(true);
	const projectId = getValues("project.id");
	const orderId = getValues("id");
	const orderStatus = getValues("status");
	const [switchProject, setSwitchProject] = useState<boolean>(false);

	const message = App.useApp().message;
	const {
		data: tasks,
		refetch: getTasks,
		isSuccess: isTasksSuccess,
		isFetching: isTasksFetching,
		isPending: isTasksPending,
	} = useQuery({
		queryKey: ["tasks", project?.id, orderId],
		queryFn: () =>
			taskService.get({
				projectId: { equals: project?.id! },
				sort: "id,asc",
				isDeleted: { equals: false },
			}),
		enabled: !!projectId,
		initialData: undefined,
		refetchOnMount: true,
	});
	// console.log("tasks", { isTasksFetching, isTasksPending });
	const {
		data: projectApi,
		refetch: getProject,
		isSuccess: isProjectSuccess,
		isFetching: isProjectFetching,
	} = useQuery({
		queryKey: ["project", projectId, orderId],
		queryFn: () => projectService.getOne(projectId),
		enabled: !!projectId,
		initialData: undefined,
		refetchOnMount: true,
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
				...tasks?.map((task: TTask) => {
					const color =
						task.status === TStatus.COMPLETED
							? COMPLETED_TASK_COLOR
							: colorPriority(task.priority!);
					return {
						start: dayjs(task.assignedDate!).toDate(),
						end: dayjs(task.expectDate).toDate(),
						name: `CĐ: ${task.name}`,
						project: task.name,
						id: task.id.toString(),
						type: "task" as const,
						progress: 100,
						isDisabled: false,
						styles: {
							progressColor: color,
							backgroundSelectedColor: color,
							progressSelectedColor: color,
							backgroundColor: color,
						},
					};
				}),
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
			setValue("project.id", 0, { shouldValidate: true });
			return;
		}
		setValue("project.id", data?.id!, { shouldValidate: true });
	};

	return (
		<Spin spinning={isProjectFetching || isTasksFetching}>
			<Card>
				<Space direction="vertical" className="flex ">
					{[TStatus.IN_PROCESS, TStatus.NEW].includes(
						orderStatus
					) && <SelectProjectForm onChange={handleSelectProject} />}

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
