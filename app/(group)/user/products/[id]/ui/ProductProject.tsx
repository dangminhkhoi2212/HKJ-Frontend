import { Skeleton, Space, Switch } from "antd";
import dayjs from "dayjs";
import { Gantt, Task } from "gantt-task-react";
import React, { useEffect, useMemo, useState } from "react";

import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import MapAnotations from "@/shared/Anotation/MapAnotation";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { Frame } from "@/shared/Frame";
import { TTask } from "@/types";
import { tagMapperUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

import { productDetailStore } from "../store";

type Props = {};
const { colorPriority } = tagMapperUtil;
const ProductProject: React.FC<Props> = ({}) => {
	const jewelry = productDetailStore((state) => state.jewelry);
	const [tasksGantt, setTasksGantt] = useState<Task[]>([]);
	console.log("🚀 ~ tasksGantt:", tasksGantt);
	const [showList, setShowList] = useState(true);
	const [getProject, getTasks] = useQueries({
		queries: [
			{
				queryKey: ["project", jewelry?.project?.id],
				queryFn: () => projectService.getOne(jewelry?.project?.id!),
			},
			{
				queryKey: [
					"tasks",
					{ projectId: { equals: jewelry?.project?.id! } },
				],
				queryFn: () =>
					taskService.get({
						projectId: { equals: jewelry?.project?.id! },
						sort: "assignedDate,asc",
					}),
			},
		],
	});
	useEffect(() => {
		if (getProject.isSuccess && getTasks.isSuccess) {
			const tasksChart: Task[] = [
				{
					start: dayjs(getProject.data.startDate).toDate(),
					end: dayjs(getProject.data.endDate).toDate(),
					name: `DA: ${getProject.data.name}`,
					project: getProject.data.name,
					id: getProject.data.id.toString(),
					type: "project" as const,
					progress: 100,
					isDisabled: false,
					styles: {
						progressColor: colorPriority(getProject.data.priority!),
					},
				},
				...getTasks?.data?.map((task: TTask) => ({
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
	}, [getProject.data, getTasks.data]);
	const renderGantt = useMemo(() => {
		const isLoading = getProject.isLoading || getTasks.isLoading;
		if (!getProject.data) return <EmptyCustom />;
		if (isLoading) return <Skeleton active loading={isLoading} />;
		if (tasksGantt.length) {
			return (
				<div className="flex flex-col gap-4">
					<Space>
						<MapAnotations />
						<div>
							<Switch
								onChange={(value) => setShowList(value)}
								checked={showList}
							/>
							Danh sách
						</div>
					</Space>
					<Gantt
						tasks={tasksGantt}
						locale="vi"
						headerHeight={60}
						columnWidth={60}
						listCellWidth={showList ? "155px" : ""}
					/>
				</div>
			);
		}
		return <EmptyCustom />;
	}, [tasksGantt, showList, showList]);
	return <Frame title="Công đoạn chế tác">{renderGantt}</Frame>;
};

export default ProductProject;
