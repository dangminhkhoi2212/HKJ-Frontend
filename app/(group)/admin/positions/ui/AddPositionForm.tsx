import { App, Button, Form } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import positionService from "@/services/positionService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { FormStatus } from "@/types/formType";
import { TPosition, TSelectedPosition } from "@/types/postionType";
import { useMutation } from "@tanstack/react-query";

const initValue: TSelectedPosition = {
	show: false,
	status: FormStatus.ADD,
	record: {
		name: "",
	},
};
const AddPositionForm: React.FC<{
	data?: TSelectedPosition;
	refreshPositionsData: () => void;
	setSelectedPosition: React.Dispatch<TSelectedPosition>;
}> = ({ setSelectedPosition, refreshPositionsData, data }) => {
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<TPosition>({
		defaultValues: data?.record || initValue.record,
	});

	const { message } = App.useApp();
	const [form] = Form.useForm();
	const addPositionMutation = useMutation({
		mutationFn: (data: TPosition) => positionService.create(data),
		onSuccess: () => {
			message.success("Đã thêm vị trí");
			reset();
			setSelectedPosition({ show: false });
			refreshPositionsData();
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	const updatePositionMutation = useMutation({
		mutationFn: (data: TPosition) => positionService.update(data),
		onSuccess: () => {
			message.success("Đã cập nhật thành công");
			reset();
			setSelectedPosition({ show: false });
			refreshPositionsData();
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});

	const handleFormSubmit = async (position: TPosition) => {
		console.log("🚀 ~ handleFormSubmit ~ position:", position);
		if (data?.status === FormStatus.UPDATE) {
			updatePositionMutation.mutate(position);
		} else {
			addPositionMutation.mutate(position);
		}
	};

	useEffect(() => {
		if (data?.record?.name) {
			setValue("id", data?.record?.id);
			setValue("name", data?.record?.name);
		}
		return () => {
			reset(initValue.record);
		};
	}, [form, data, setValue, reset]);
	return (
		<Form
			form={form}
			layout="vertical"
			size="large"
			onFinish={handleSubmit(handleFormSubmit)}
		>
			<InputCustom
				label="Vị trí"
				name="name"
				placeholder="Vị trí"
				control={control}
				errorMessage={errors?.name?.message?.toString()}
			/>
			<div className="flex gap-2 justify-end">
				<Button
					size="middle"
					onClick={() => setSelectedPosition(initValue)}
				>
					Hủy
				</Button>
				<Button
					htmlType="submit"
					type="primary"
					size="middle"
					loading={
						addPositionMutation.isLoading ||
						updatePositionMutation.isLoading
					}
				>
					{data?.status === FormStatus.UPDATE ? "Cập nhật" : "Thêm"}
				</Button>
			</div>
		</Form>
	);
};

export default AddPositionForm;
