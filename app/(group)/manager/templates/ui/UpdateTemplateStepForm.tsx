import { App, Button, Form } from "antd";
import { Save, Trash } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { KEY_CONST } from "@/const";
import templateStepService from "@/services/templateStepService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { TTemplateStep, TTemplateStepCreate } from "@/types";
import templateStepValidation from "@/validations/templateStepValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { templateStepStore } from "../store";

type TForm = TTemplateStep;

const initValue: TForm = {
	id: -1,
	name: "",
	hkjTemplate: {} as TTemplateStepCreate["hkjTemplate"],
};
const templateStepSchema = templateStepValidation.templateStepSchema;
type Props = {
	data: TTemplateStep;
};
const UpdateTemplateStepForm: React.FC<Props> = ({ data }) => {
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: data,
		resolver: yupResolver(templateStepSchema),
	});
	console.log("🚀 ~ errors:", errors);
	const message = App.useApp().message;
	const { setToggleRefreshStep } = templateStepStore();

	const {
		data: _,
		mutate: update,
		isLoading: isLoadingUpdate,
	} = useMutation({
		mutationFn: (data: TForm) => templateStepService.update(data),
		onSuccess(data, variables, context) {
			message.success("Đã cập bước thành công");
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
		onSettled() {
			setToggleRefreshStep();
		},
	});
	const {
		data: __,
		mutate: deleteStep,
		isLoading: isLoadingDelete,
	} = useMutation({
		mutationFn: (data: TForm) => templateStepService.deleteOne(data.id),

		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
		onSettled() {
			setToggleRefreshStep();
		},
	});

	return (
		<Form
			layout="vertical"
			onFinish={handleSubmit((data) => update(data))}
			className="grid grid-cols-10  gap-2 items-start"
		>
			<div className="col-span-9">
				<InputCustom
					control={control}
					required={false}
					name="name"
					type="textarea"
					className="w-full"
					placeholder="Nhập bước thực hiện"
					errorMessage={errors.name?.message}
					suffix="Vui lóng nhập bước thực hiện"
					rows={2}
				/>
			</div>
			<div className="col-span-1 flex justify-center items-center flex-col gap-1">
				<Button
					htmlType="submit"
					loading={isLoadingUpdate}
					disabled={isLoadingUpdate || isLoadingDelete}
					size="small"
					icon={<Save size={14} />}
				/>
				<Button
					danger
					disabled={isLoadingUpdate || isLoadingDelete}
					loading={isLoadingDelete}
					size="small"
					icon={<Trash size={14} onClick={() => deleteStep(data)} />}
				/>
			</div>
		</Form>
	);
};

export default UpdateTemplateStepForm;
