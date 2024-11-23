import { Button, DatePicker, Form, message, Modal, Space, Spin } from "antd";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useRouterCustom } from "@/hooks";
import taskService from "@/services/taskService";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectStatusForm } from "@/shared/FormSelect";
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
type Props = { refresh: () => void };
const schema = taskValidation.createTaskSchema;
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];

const CreateTaskButton: React.FC<Props> = ({ refresh }) => {
	const { project } = updateProjectStore();
	const { params } = useRouterCustom();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [initValue, setInitValue] = useState<TForm>({
		name: "",
		description: "",
		status: TStatus.IN_PROCESS,
		priority: TPriority.MEDIUM,
		date: {
			startDate: dayjs().hour(0).toISOString(),
			endDate: dayjs().add(1, "week").hour(23).toISOString(),
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
				expectDate: dayjs(data.date.endDate!).hour(23).toISOString(),
			};
			if ("date" in dataConvert) delete dataConvert.date;
			return taskService.create(dataConvert);
		},
		onSuccess(data, variables, context) {
			message.success("Giao việc thành công!");
			refresh();
		},
		onSettled() {
			reset(initValue);
			setShowModal(false);
		},
	});
	useEffect(() => {
		return () => {
			reset(initValue);
		};
	}, [showModal]);
	return (
		<div>
			<Modal
				title="Giao việc"
				open={showModal}
				okText="Tạo"
				cancelText="Hủy"
				onClose={() => setShowModal(false)}
				onOk={() => handleSubmit((data) => mutateAsync(data))()}
				onCancel={() => setShowModal(false)}
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
							{errors.employee?.id?.message && (
								<span className="text-red-400">
									{errors?.employee?.id?.message}
								</span>
							)}
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
							<Controller
								name="status"
								control={control}
								render={({ field }) => (
									<SelectStatusForm
										{...field}
										size="large"
										allowClear={false}
										ignoreStatus={[
											TStatus.DELIVERED,
											TStatus.NEW,
										]}
										className="w-40"
									/>
								)}
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
			<Button
				icon={<Plus size={18} />}
				type="primary"
				onClick={() => setShowModal(true)}
			>
				Giao việc
			</Button>
		</div>
	);
};

export default memo(CreateTaskButton);
