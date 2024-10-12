"use client";
import { Button, Divider, Empty, Skeleton, Space, Switch, Tag } from "antd";
import dayjs from "dayjs";
import { Gantt, ViewMode } from "gantt-task-react";
import { Plus, RotateCcw } from "lucide-react";
import React from "react";
import { useQuery } from "react-query";

import taskService from "@/services/taskService";
import { TPriority, TTask } from "@/types";

import { updateProjectStore } from "../store";
import CreateTask from "./CreateTask";

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
const MapAnotations: React.FC<{}> = () => (
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
);
const UpdateProcessing: React.FC<Props> = ({}) => {
	const { project, setShowCreateTask, tasks, addTask, setTasks } =
		updateProjectStore();
	const [showList, setShowList] = React.useState(true);
	const { data, refetch, isLoading, isFetching } = useQuery({
		queryKey: ["tasks", project?.id],
		queryFn: () =>
			taskService.get({
				projectId: { equals: project?.id },
			}),
		onSuccess(data: TTask[]) {
			console.log("🚀 ~ onSuccess ~ data:", data);
			setTasks([]);
			if (project && project.startDate && project.endDate)
				addTask({
					start: dayjs(project?.startDate).toDate(),
					end: dayjs(project?.endDate).toDate(),
					name: "DA: " + project?.name!,
					project: project?.name,
					id: project.id.toString(),
					type: "project",
					progress: 100,
					isDisabled: false,
					styles: {
						progressColor: colorPriority(project.priority!),
					},
				});
			data.forEach((task: TTask) => {
				addTask({
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
		},
	});
	if (!tasks.length) return <Empty description="Không có dữ liệu" />;

	return (
		<div>
			{isLoading || isFetching ? (
				<Skeleton
					active={isLoading || isFetching}
					loading={isLoading || isFetching}
				/>
			) : (
				<Space direction="vertical" className="flex" size={"large"}>
					<CreateTask />
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
							onClick={() => setShowCreateTask(true)}
						>
							Giao việc
						</Button>
					</Space>
					<Space>
						<MapAnotations />
					</Space>
					<Gantt
						tasks={tasks}
						locale="vi" // Sets locale to Vietnamese (if supported)
						headerHeight={60}
						columnWidth={60}
						// Custom labels for translation
						listCellWidth={showList ? "155px" : ""}
						onClick={(data) => {
							console.log("🚀onClick ~ data:", data);
							return;
						}}
						onProgressChange={(data) => {
							console.log("onProgressChange ~ data:", data);
							return;
						}}
						viewMode={ViewMode.Day}
					/>
				</Space>
			)}
		</div>
	);
};

export default UpdateProcessing;
