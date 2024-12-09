import { App, Button, DatePicker, Form, Modal, Space, Spin } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectStatusForm } from "@/shared/FormSelect";
import { AccountDisplay } from "@/shared/FormSelect/AccountForm";
import { SelectEmployeeForm } from "@/shared/FormSelect/SelectEmployeeForm";
import { TEmployee, TPriority, TStatus } from "@/types";
import { TTask, TTaskUpdate } from "@/types/taskType";
import { formatUtil, tagMapperUtil } from "@/utils";
import taskValidation from "@/validations/taskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProjectStore } from "../store";

const { TPriorityMapper, TStatusMapper } = tagMapperUtil;
const { RangePicker } = DatePicker;
type Props = { refresh: () => void };
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
const UpdateTask: React.FC<Props> = ({ refresh }) => {
	const { showUpdateTask, setShowUpdateTask, project } = updateProjectStore();
	console.log("🚀 ~ showUpdateTask:", showUpdateTask);
	const { params } = useRouterCustom();
	const [initValue, setInitValue] = useState<TForm>(() =>
		convertDateToForm(showUpdateTask.task!)
	);
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
		mode: "onChange",
	});
	console.log("🚀 ~ errors:", errors);
	const queryClient = useQueryClient();
	const message = App.useApp().message;
	const { data, mutateAsync, isPending } = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TTaskUpdate = {
				...data,
				assignedDate: dayjs(data.date.startDate!).toISOString(),
				expectDate: dayjs(data.date.endDate!).toISOString(),
				completedDate:
					data.status === TStatus.COMPLETED
						? dayjs().toISOString()
						: "",
			};
			if ("date" in dataConvert) delete dataConvert.date;
			return taskService.update(dataConvert);
		},
		onSuccess(data, variables, context) {
			refresh();
		},
		onError() {
			message.error(KEY_CONST.ERROR_MESSAGE);
			refresh();
		},
		onSettled() {
			setShowUpdateTask({ show: false, task: null });
		},
	});

	const handleDelete = useMutation({
		mutationFn: () => {
			return taskService.deleteOne(showUpdateTask.task?.id!);
		},
		onSuccess(data, variables, context) {
			message.success("Đã xóa công việc thành công");
			refresh();
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
			okButtonProps={{
				loading: isPending,
				disabled: handleDelete.isPending,
			}}
			cancelButtonProps={{
				disabled: isPending || handleDelete.isPending,
			}}
			footer={(originNode) => (
				<Space className="flex justify-between">
					<Button
						danger
						onClick={() => handleDelete.mutate()}
						loading={handleDelete.isPending}
						disabled={isPending}
					>
						Xóa
					</Button>
					<Space>{originNode}</Space>
				</Space>
			)}
		>
			<Spin spinning={isPending || handleDelete.isPending}>
				<Form
					layout="vertical"
					className="flex flex-col gap-5 max-h-96 overflow-auto"
				>
					<p>
						{" "}
						Thời gian cập nhật:{" "}
						{formatUtil.formatDate(
							showUpdateTask?.task?.lastModifiedDate!
						)}
					</p>
					<p>
						{" "}
						Thời gian hoàn thành:{" "}
						{formatUtil.formatDate(
							showUpdateTask?.task?.completedDate!
						)}
					</p>
					<Space direction="vertical" className="flex">
						<SelectEmployeeForm
							defaultValueId={initValue.employee.id}
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

					<Space direction="vertical">
						<LabelCustom label="Trạng thái" />

						<SelectStatusForm
							defaultValue={showUpdateTask.task?.status}
							size="large"
							allowClear={false}
							ignoreStatus={[
								TStatus.DELIVERED,
								TStatus.NEW,
								TStatus.CANCEL,
							]}
							onChange={(value) => setValue("status", value)}
							className="w-40"
						/>
					</Space>
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
