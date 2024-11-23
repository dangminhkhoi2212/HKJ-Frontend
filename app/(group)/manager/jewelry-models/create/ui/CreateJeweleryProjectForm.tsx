"use client";
import { App, Button, Empty, Form, Skeleton, Space, Spin, Switch } from "antd";
import dayjs from "dayjs";
import { Gantt } from "gantt-task-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { jewelryService } from "@/services";
import taskService from "@/services/taskService";
import MapAnotations from "@/shared/Anotation/MapAnotation";
import DisplayProject from "@/shared/FormSelect/SelectProjectForm/DisplayProject";
import SelectProjectForm from "@/shared/FormSelect/SelectProjectForm/SelectProjectForm";
import { GantTaskTooltipCustom } from "@/shared/GanttTaskCustom";
import { TGanttTaskCustom, TJewelry, TProject, TTask } from "@/types";
import { tagMapperUtil } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createJewelryStore } from "../store";

const { colorPriority } = tagMapperUtil;
type TForm = {
	id: number;
	project: { id: number } | null;
};

const CreateJeweleryProjectForm: React.FC = () => {
	const jewelry = createJewelryStore((state) => state.jewelry);
	const router = useRouterCustom().router;

	const { setValue, getValues, handleSubmit } = useForm<TForm>();
	const queryClient = useQueryClient();
	const [project, setProject] = useState<TProject | null>(null);
	const [tasksGantt, setTasksGantt] = useState<TGanttTaskCustom[]>([]);
	const [showList] = useState(true);

	const [switchProject, setSwitchProject] = useState<boolean>(true);

	useEffect(() => {
		setValue("id", jewelry?.id!);
	}, [jewelry]);
	const message = App.useApp().message;
	const {
		data: tasks,
		refetch: getTasks,
		isSuccess: isTasksSuccess,
		isFetching: isTasksFetching,
		isPending: isTasksPending,
	} = useQuery({
		queryKey: ["tasks", { projectId: project?.id }],
		queryFn: () => taskService.get({ projectId: { equals: project?.id! } }),
		enabled: !!project?.id,
	});
	console.log("tasks", { isTasksFetching, isTasksPending });

	useEffect(() => {
		if (isTasksSuccess && project) {
			const tasksChart: TGanttTaskCustom[] = [
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
					more: { status: project.status! },
				},
				...tasks!.map((task: TTask) => ({
					start: dayjs(task.assignedDate!).toDate(),
					end: dayjs(task.expectDate).toDate(),
					name: `CĐ: ${task.name}`,
					project: task.name,
					id: task.id.toString(),
					type: "task" as const,
					progress: 100,
					isDisabled: false,
					styles: { progressColor: colorPriority(task.priority!) },
					more: { status: task.status! },
				})),
			];
			setTasksGantt(tasksChart);
		}
	}, [tasks, getTasks, project, isTasksSuccess]);

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
	}, [tasksGantt, switchProject]);

	const handleSelectProject = (data: TProject | null) => {
		setProject(data);
		if (!data) {
			setTasksGantt([]);
			setValue("project", null, { shouldValidate: true });
			return;
		}
		setValue("project.id", data?.id!, { shouldValidate: true });
	};

	const { mutate: updateProject, isPending: isUpdateProjectLoading } =
		useMutation({
			mutationFn: (data: TForm) => {
				return jewelryService.updatePartical({
					// ...jewelry!,
					...data!,
				});
			},
			onSuccess: (data: TJewelry) => {
				message.success("Đã thêm dự án mới cho trang sức");
				router.push(routesManager.jewelry);
			},
			onError(error, variables, context) {
				message.error(KEY_CONST.ERROR_MESSAGE);
			},
		});

	const handelAddProject = (data: TForm) => {
		if (!data?.project?.id) {
			return;
		}
		updateProject(data);
	};

	return (
		<Spin spinning={isUpdateProjectLoading}>
			<Form
				onFinish={handleSubmit((data) => handelAddProject(data))}
				layout="vertical"
			>
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
					<div className="flex justify-end">
						<Button type="primary" htmlType="submit">
							Hoàn tất
						</Button>
					</div>
				</Space>
			</Form>
		</Spin>
	);
};

export default CreateJeweleryProjectForm;
