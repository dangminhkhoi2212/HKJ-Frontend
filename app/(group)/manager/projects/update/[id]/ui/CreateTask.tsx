import { DatePicker, Form, Modal, Space, Spin } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { SelectEmployeeForm } from "@/shared/FormSelect/SelectEmployeeForm";
import { TEmployee, TPriority, TStatus } from "@/types";
import { TTaskCreate } from "@/types/taskType";
import { tagMapperUtil } from "@/utils";
import taskValidation from "@/validations/taskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectStore } from "../store";

const { TPriorityMapper, TStatusMapper } = tagMapperUtil;
const { RangePicker } = DatePicker;
type Props = {};
const schema = taskValidation.createTaskSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];

const CreateTask: React.FC<Props> = ({}) => {
	const { showCreateTask, setShowCreateTask, project } = updateProjectStore();
	const { params } = useRouterCustom();
	console.log("🚀 ~ params:", params);
	const [initValue, setInitValue] = useState<TForm>({
		name: "",
		description: "",
		status: TStatus.NEW,
		priority: TPriority.MEDIUM,
		date: {
			startDate: dayjs().toISOString(),
			endDate: dayjs().add(1, "week").toISOString(),
		},
		project: { id: project?.id! },
		employee: { id: 0 },
	});
	const [selectedEmployee, setSelectedEmployee] = useState<TEmployee | null>(
		null
	);

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
	const queryClient = useQueryClient();

	const { data, mutateAsync, isPending } = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TTaskCreate = {
				...data,
				assignedDate: dayjs(data.date.startDate!).toISOString(),
				expectDate: dayjs(data.date.endDate!).toISOString(),
			};
			if ("date" in dataConvert) delete dataConvert.date;
			console.log("🚀 ~ dataConvert:", dataConvert);
			return taskService.create(dataConvert);
		},
		onSuccess(data, variables, context) {
			queryClient.invalidateQueries({
				queryKey: ["tasks", project?.id],
			});
		},
		onSettled() {
			reset(initValue);
			setShowCreateTask(false);
		},
	});
	useEffect(() => {
		return () => {
			reset(initValue);
		};
	}, [showCreateTask]);
	return (
		<Modal
			title="Giao việc"
			open={showCreateTask}
			okText="Tạo"
			cancelText="Hủy"
			onClose={() => setShowCreateTask(false)}
			onOk={() => handleSubmit((data) => mutateAsync(data))()}
			onCancel={() => setShowCreateTask(false)}
			okButtonProps={{ loading: isPending }}
		>
			<Spin spinning={isPending}>
				<Form
					layout="vertical"
					className="flex flex-col gap-5 max-h-96 overflow-auto"
				>
					<Space direction="vertical" className="col-span-3 flex">
						<SelectEmployeeForm
							onChange={(data) => {
								setSelectedEmployee(data);
								setValue("employee.id", data.id!);
							}}
						/>
						{selectedEmployee && (
							<AccountDisplay account={selectedEmployee} />
						)}
					</Space>
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
						minDate={dayjs(project?.startDate)}
						maxDate={dayjs(project?.endDate)}
					/>

					<InputCustom
						control={control}
						name="status"
						label="Trạng thái"
						type="select"
						options={Object.entries(TStatus).map(
							([key, value]) => ({
								label: TStatusMapper(value),
								value: key,
							})
						)}
						className="w-40"
					/>
					<InputCustom
						control={control}
						name="priority"
						label="Độ ưu tiên"
						type="select"
						options={Object.entries(TPriority).map(
							([key, value]) => ({
								label: TPriorityMapper(value),
								value: key,
							})
						)}
						className="w-40"
					/>
					<InputCustom
						control={control}
						name="description"
						type="description"
					/>
				</Form>
			</Spin>
		</Modal>
	);
};

export default CreateTask;
