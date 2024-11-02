"use client";
import { App, Button, DatePicker, Form, Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { KEY_CONST } from '@/const';
import { hireService } from '@/services';
import { InputNumberCustom, LabelCustom } from '@/shared/FormCustom/InputCustom';
import NumberToWords from '@/shared/FormCustom/InputNumToWords/InputNumToWords';
import { AccountDisplay } from '@/shared/FormSelect/AccountForm';
import { SelectEmployeeForm } from '@/shared/FormSelect/SelectEmployeeForm';
import { SelectePositionForm } from '@/shared/FormSelect/SelectePositionForm';
import { TEmployee } from '@/types';
import { THire } from '@/types/hireType';
import { TPosition } from '@/types/postionType';
import { hireEmployeeSchema } from '@/validations/hireEmployee';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

const defaultSalary: number = 0;

const HireEmployeeForm: React.FC<{}> = () => {
	const [form] = Form.useForm();

	const [selectedPosition, setSeletedPosition] = useState<TPosition | null>(
		null
	);

	const [selectedEmployee, setSelectedEmployee] = useState<TEmployee | null>(
		null
	);

	const {
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(hireEmployeeSchema),
		reValidateMode: "onChange",
		defaultValues: {
			beginSalary: defaultSalary.toString(),
		},
	});
	console.log("🚀 ~ HireEmployeeForm ~ errors:", errors);

	const { message } = App.useApp();
	const handleHireEmployee = (data: any) => {
		const dataMapper: THire = {
			...data,
			beginDate: dayjs(data.beginDate).format(),
			endDate: dayjs(data.endDate).format(),
			position: {
				id: parseInt(data.position),
			},
			employee: {
				id: data.employee,
			},
		} as THire;
		createHireMutation.mutate(dataMapper);
	};
	const createHireMutation = useMutation({
		mutationFn: (data: THire) => {
			return hireService.create(data);
		},
		onSuccess(data, variables, context) {
			resetForm();
			message.success("Đã tạo dữ liệu thuê thành công");
		},
		onError: (error) => {
			console.log("🚀 ~ createHireMutation ~ error:", error);
			message.success("Đã có lỗi xảy ra xin vui lòng thử lại");
		},
	});
	const resetForm = () => {
		setSeletedPosition(null);
		setSelectedEmployee(null);
		reset();
	};

	return (
		<div>
			{/* ############################## */}
			<Form
				onFinish={handleSubmit(handleHireEmployee)}
				form={form}
				layout="vertical"
				validateTrigger="onChange"
				className="flex flex-col gap-4"
			>
				<div className="grid grid-cols-1 md:gird-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-4 ">
					<div className="col-span-2 grid grid-cos-1 gap-4 place-self-start">
						<Controller
							name="date"
							control={control}
							rules={{ required: true }}
							render={({ field }) => {
								return (
									<Form.Item
										label={
											<LabelCustom
												label="Thời gian làm việc"
												required
											/>
										}
										help={
											errors?.date?.startDate?.message ||
											errors?.date?.endDate?.message
										}
										validateStatus={
											errors?.date?.startDate?.message ||
											errors?.date?.endDate?.message
												? "error"
												: ""
										}
									>
										<RangePicker
											allowClear={false}
											value={
												field.value
													? [
															dayjs(
																field.value
																	.startDate
															),
															dayjs(
																field.value
																	.endDate
															),
														]
													: undefined
											} // Handle value
											onChange={(dates) => {
												if (dates)
													field.onChange({
														startDate: dates![0],
														endDate: dates![1],
													});
											}}
											size="large"
											className="w-80"
											placeholder={[
												"Ngày bắt đầu",
												"Ngày kết thúc",
											]}
											format={KEY_CONST.DATE_FORMAT}
										/>
									</Form.Item>
								);
							}}
						/>

						<Space direction="vertical">
							<SelectePositionForm
								onChange={(data: TPosition) =>
									setSeletedPosition(data)
								}
							/>
							{selectedPosition && (
								<p>
									Ví trí:{" "}
									<span className="font-semibold">
										{selectedPosition.name}
									</span>
								</p>
							)}
						</Space>
						<div>
							<InputNumberCustom
								label="Mức lương khởi điểm"
								name="beginSalary"
								control={control}
								className="max-w-80"
								defaultValue={defaultSalary}
								errorMessage={errors?.beginSalary?.message}
								suffix=" VND"
								min={1000}
							/>
							<NumberToWords
								number={Number.parseInt(watch("beginSalary"))}
							/>
						</div>
					</div>

					<Space direction="vertical" className="col-span-3 flex">
						<SelectEmployeeForm
							onChange={(data) => {
								setSelectedEmployee(data);
							}}
						/>
						{selectedEmployee && (
							<AccountDisplay account={selectedEmployee} />
						)}
					</Space>
				</div>

				<div className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						loading={createHireMutation.isPending}
					>
						Bắt đầu thuê
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default HireEmployeeForm;
