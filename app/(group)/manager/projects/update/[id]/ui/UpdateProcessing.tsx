"use client";
import { Button, Empty, Skeleton, Space, Switch } from "antd";
import dayjs from "dayjs";
import { Gantt, ViewMode } from "gantt-task-react";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import MapAnotations from "@/shared/Anotation/MapAnotation";
import { GantTaskTooltipCustom } from "@/shared/GanttTaskCustom";
import { TGanttTaskCustom, TPriority, TStatus, TTask } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { updateProjectStore } from "../store";
import CreateTaskButton from "./CreateTaskButton";
import UpdateTask from "./UpdateTask";

type Props = {};
const colorPriority = (priority: TPriority): string => {
	console.log("🚀 ~ colorPriority ~ priority:", priority);
	switch (priority) {
		case TPriority.LOW:
			return "#0079FF";
		case TPriority.MEDIUM:
			return "#06D001";
		case TPriority.HIGH:
			return "#FF6363";
		default:
			return "#F1D4D4";
	}
};

const UpdateProcessing: React.FC<Props> = ({}) => {
	const { project, setShowCreateTask, setShowUpdateTask, showUpdateTask } =
		updateProjectStore();
	console.log("🚀UpdateProcessing ~ project:", project);
	const { params } = useRouterCustom();
	const [projectId, setProjectId] = useState<number | null>(() => {
		return params.id;
	});
	const [showModal, setShowModal] = useState<{
		show: boolean;
		task: { id: number; name: string } | null;
	}>({
		show: false,
		task: null,
	});
	const [tasksGantt, setTasksGantt] = useState<TGanttTaskCustom[]>([]);
	console.log("🚀 ~ tasksGantt:", tasksGantt);
	const [showList, setShowList] = React.useState(true);
	const {
		data: tasks,
		refetch: refresh,
		isPending,
		isFetching,
		isSuccess,
		error,
	} = useQuery({
		queryKey: ["tasks", projectId],
		queryFn: () =>
			taskService.get({
				projectId: { equals: project?.id! },
				sort: "assignedDate,asc",
			}),
		enabled: !!project?.id!,
	});
	useEffect(() => {
		if (isSuccess) {
			const tasksChart: TGanttTaskCustom[] = [
				{
					start: dayjs(project?.startDate).toDate(),
					end: dayjs(project?.endDate).toDate(),
					name: "DA: " + project?.name!,
					project: project?.name,
					id: project!.id.toString(),
					type: "project",
					progress: 100,
					isDisabled: false,
					styles: {
						progressColor: colorPriority(project!.priority!),
						backgroundSelectedColor: colorPriority(
							project?.priority!
						),
					},
					more: { status: project?.status! },
				},
			];
			tasks?.forEach((task: TTask, index: number) => {
				tasksChart.push({
					start: dayjs(task?.assignedDate!).toDate(),
					end: dayjs(task?.expectDate).toDate(),
					name: "CĐ: " + task?.name!,
					project: task?.name,
					id: task.id.toString(),
					type: "task",
					progress: task.status === TStatus.COMPLETED ? 100 : 0,
					isDisabled: false,
					dependencies: [
						index === 0
							? project?.id?.toString()!
							: tasks[index - 1].id.toString(),
					],
					styles: {
						progressColor: colorPriority(task.priority!),
						backgroundSelectedColor: colorPriority(task.priority!),
					},
					more: { status: task?.status! },
				});
			});
			setTasksGantt(tasksChart);
		} else {
			console.log("🚀 ~ useEffect ~ error:", error);
		}
	}, [tasks, refresh, project]);

	const renderGantt = useMemo(() => {
		if (isPending || isFetching) {
			return (
				<Skeleton
					active={isPending || isFetching}
					loading={isPending || isFetching}
				/>
			);
		}
		if (tasksGantt!.length) {
			return (
				<Gantt
					tasks={tasksGantt}
					locale="vie" // Sets locale to Vietnamese (if supported)
					headerHeight={60}
					columnWidth={60}
					// Custom labels for translation
					listCellWidth={showList ? "155px" : ""}
					onClick={(data) => {
						setShowUpdateTask({
							show: true,
							task: tasks?.find(
								(item) => item.id.toString() === data.id
							)!,
						});
					}}
					viewMode={ViewMode.Day}
					TooltipContent={({ task }) => (
						<GantTaskTooltipCustom task={task} />
					)}
				/>
			);
		}
		return <Empty description="Chưa có dữ liệu"></Empty>;
	}, [isPending, isFetching, tasksGantt, showList]);
	return (
		<div>
			<Space direction="vertical" className="flex" size={"large"}>
				{showUpdateTask?.task && <UpdateTask />}
				<Space className="flex justify-between">
					<Button
						icon={<RotateCcw size={18} />}
						onClick={() => refresh()}
					>
						Làm mới
					</Button>
					<Space>
						<Switch
							checked={showList}
							onChange={() => {
								setShowList(!showList);
							}}
						/>
						{showList ? "Hiển thị danh sách" : "Ẩn danh sách"}
					</Space>
					<CreateTaskButton refresh={refresh} />
				</Space>
				<Space>
					<MapAnotations />
				</Space>

				{renderGantt}
			</Space>
		</div>
	);
};

export default UpdateProcessing;
