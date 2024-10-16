"use client";
import { Button, Divider, Empty, Skeleton, Space, Switch, Tag } from "antd";
import dayjs from "dayjs";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import { Plus, RotateCcw } from "lucide-react";
import React, { memo, useEffect, useMemo, useState } from "react";

import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import { TPriority, TTask } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { updateProjectStore } from "../store";
import CreateTask from "./CreateTask";
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
export const MapAnotations = memo(() => (
	<Space className="flex">
		<Space direction="vertical">
			<p className="font-semibold">Độ ưu tiên</p>
			<Space>
				<Tag color={colorPriority(TPriority.LOW)}>Thấp</Tag>
				<Tag color={colorPriority(TPriority.MEDIUM)}>Trung Bình</Tag>
				<Tag color={colorPriority(TPriority.HIGH)}>Cao</Tag>
			</Space>
		</Space>
		<Divider type="vertical" className="m-1 h-fit" />
		<Space direction="vertical">
			<p className="font-semibold">Chú thích</p>
			<Space>
				<span>DA: Dự án</span>
				<span>CĐ: Công đoạn</span>
			</Space>
		</Space>
	</Space>
));
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
	const [tasksGantt, setTasksGantt] = useState<Task[]>([]);
	console.log("🚀 ~ tasksGantt:", tasksGantt);
	const [showList, setShowList] = React.useState(true);
	const {
		data: tasks,
		refetch,
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
			const tasksChart: Task[] = [
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
					},
				},
			];
			tasks?.forEach((task: TTask) => {
				tasksChart.push({
					start: dayjs(task?.assignedDate!).toDate(),
					end: dayjs(task?.expectDate).toDate(),
					name: "CĐ: " + task?.name!,
					project: task?.name,
					id: task.id.toString(),
					type: "task",
					progress: 100,
					isDisabled: false,
					styles: {
						progressColor: colorPriority(task.priority!),
					},
				});
			});
			setTasksGantt(tasksChart);
		} else {
			console.log("🚀 ~ useEffect ~ error:", error);
		}
	}, [tasks, refetch, project]);

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
					locale="vi" // Sets locale to Vietnamese (if supported)
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
				/>
			);
		}
		return <Empty description="Chưa có dữ liệu"></Empty>;
	}, [isPending, isFetching, tasksGantt, showList]);
	return (
		<div>
			<Space direction="vertical" className="flex" size={"large"}>
				<CreateTask />
				{showUpdateTask?.task && <UpdateTask />}
				<Space className="flex justify-between">
					<Button
						icon={<RotateCcw size={18} />}
						onClick={() => refetch()}
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
					<Button
						icon={<Plus size={18} />}
						type="primary"
						onClick={() => setShowCreateTask(true)}
					>
						Giao việc
					</Button>
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
