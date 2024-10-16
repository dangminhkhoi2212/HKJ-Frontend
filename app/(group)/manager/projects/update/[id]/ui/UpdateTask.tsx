import { DatePicker, Form, message, Modal, Spin } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { SelectEmployeeForm } from "@/shared/FormSelect/SelectEmployeeForm";
import { TEmployee, TPriority, TStatus } from "@/types";
import { TTask, TTaskUpdate } from "@/types/taskType";
import { tagMapperUtil } from "@/utils";
import taskValidation from "@/validations/taskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectStore } from "../store";

const { TPriorityMapper, TStatusMapper } = tagMapperUtil;
const { RangePicker } = DatePicker;
type Props = {};
const schema = taskValidation.updateTaskSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const convertDateToForm = (data: TTask): TForm => ({
	...data,
	date: {
		startDate: dayjs(data!.assignedDate).toISOString(),
		endDate: dayjs(data!.expectDate).toISOString(),
	},
	employee: { id: data!.employee.id! },
});
const UpdateTask: React.FC<Props> = ({}) => {
	const { showUpdateTask, setShowUpdateTask, project } = updateProjectStore();
	console.log("🚀 ~ showUpdateTask:", showUpdateTask);
	const { params } = useRouterCustom();
	const [initValue, setInitValue] = useState<TForm>(() =>
		convertDateToForm(showUpdateTask.task!)
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
		mode: "onChange",
	});
	console.log("🚀 ~ errors:", errors);
	const queryClient = useQueryClient();

	const { data, mutateAsync, isPending } = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TTaskUpdate = {
				...data,
				assignedDate: dayjs(data.date.startDate!).toISOString(),
				expectDate: dayjs(data.date.endDate!).toISOString(),
			};
			if ("date" in dataConvert) delete dataConvert.date;
			console.log("🚀 ~ dataConvert:", dataConvert);
			// return new Promise((resolve) => resolve);
			return taskService.update(dataConvert);
		},
		onSuccess(data, variables, context) {
			queryClient.invalidateQueries({
				queryKey: ["tasks", project?.id],
			});
		},
		onError() {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
		onSettled() {
			setShowUpdateTask({ show: false, task: null });
		},
	});

	return (
		<Modal
			title="Giao việc"
			open={showUpdateTask.show}
			okText="Cập nhật"
			cancelText="Hủy"
			onClose={() => setShowUpdateTask({ show: false, task: null })}
			onOk={() => handleSubmit((data) => mutateAsync(data))()}
			onCancel={() => setShowUpdateTask({ show: false, task: null })}
			okButtonProps={{ loading: isPending }}
		>
			<Spin spinning={isPending}>
				<Form
					layout="vertical"
					className="flex flex-col gap-5 max-h-96 overflow-auto"
				>
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

export default UpdateTask;