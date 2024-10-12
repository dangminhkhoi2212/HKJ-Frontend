import { Form, Modal } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import taskService from "@/services/taskService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { SelectEmployeeForm } from "@/shared/FormSelect/SelectEmployeeForm";
import {
	TEmployee,
	TPriority,
	TPriorityMapper,
	TStatus,
	TStatusMapper,
} from "@/types";
import { TTaskCreate } from "@/types/taskType";
import taskValidation from "@/validations/taskValidation";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateProjectStore } from "../store";

type Props = {};
const schema = taskValidation.createTaskSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];

const CreateTask: React.FC<Props> = ({}) => {
	const { showCreateTask, setShowCreateTask, projectId, addTask } =
		updateProjectStore();
	const [initValue, setInitValue] = useState<TForm>({
		name: "",
		description: "",
		status: TStatus.NEW,
		priority: TPriority.MEDIUM,
		date: {
			startDate: dayjs().toISOString(),
			endDate: dayjs().add(1, "week").toISOString(),
		},
		project: { id: projectId! },
		employee: { id: 0 },
	});
	console.log("🚀 ~ showCreateTask:", showCreateTask);
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
		mode: "all",
	});
	console.log("🚀 ~ errors:", errors);

	const { data, mutate, isLoading } = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TTaskCreate = {
				...data,
				assignedDate: dayjs(data.date.startDate!).toISOString(),
				expectDate: dayjs(data.date.endDate!).toISOString(),
				project: {
					id: projectId!,
				},
			};
			if ("date" in dataConvert) delete dataConvert.date;
			console.log("🚀 ~ dataConvert:", dataConvert);
			return taskService.create(dataConvert);
		},
		onSuccess(data, variables, context) {
			reset(initValue);
			addTask({
				start: dayjs(data?.assignedDate).toDate(),
				end: dayjs(data?.expectDate).toDate(),
				name: data?.name!,
				project: data?.name,
				id: data.id.toString(),
				type: "task",
				progress: 100,
				isDisabled: false,
				styles: {
					progressColor: "#ffbb54",
					progressSelectedColor: "#ff9e0d",
				},
			});
		},
		onSettled() {
			setShowCreateTask(false);
			reset(initValue);
		},
	});
	return (
		<Modal
			title="Giao việc"
			open={showCreateTask}
			okText="Tạo"
			cancelText="Hủy"
			onClose={() => setShowCreateTask(false)}
			onOk={() => handleSubmit((data) => mutate(data))()}
			onCancel={() => setShowCreateTask(false)}
			okButtonProps={{ loading: isLoading }}
			loading={isLoading}
		>
			<Form layout="vertical" className="flex flex-col gap-5">
				<SelectEmployeeForm
					control={control}
					name="employee.id"
					onChange={(data: TEmployee) => {
						setValue("employee.id", data.id!);
					}}
				/>
				<InputCustom
					control={control}
					name="name"
					label="Tên công đoạn"
					placeholder="Tên công đoạn"
				/>
				<InputCustom
					control={control}
					name="date"
					label="Thời gian dự án"
					type="rangeDate"
				/>

				<InputCustom
					control={control}
					name="status"
					label="Trạng thái"
					type="select"
					options={Object.entries(TStatus).map(([key, value]) => ({
						label: TStatusMapper(value),
						value: key,
					}))}
					className="w-40"
				/>
				<InputCustom
					control={control}
					name="priority"
					label="Độ ưu tiên"
					type="select"
					options={Object.entries(TPriority).map(([key, value]) => ({
						label: TPriorityMapper(value),
						value: key,
					}))}
					className="w-40"
				/>
				<InputCustom
					control={control}
					name="description"
					type="description"
				/>
			</Form>
		</Modal>
	);
};

export default CreateTask;
