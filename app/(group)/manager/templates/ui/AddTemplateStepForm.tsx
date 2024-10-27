import { App, Button, Form } from "antd";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { KEY_CONST } from "@/const";
import templateStepService from "@/services/templateStepService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { TTemplateStepCreate } from "@/types";
import templateStepValidation from "@/validations/templateStepValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { templateStepStore, templateStore } from "../store";

type TForm = TTemplateStepCreate;

const initValue: TForm = {
	name: "",
	hkjTemplate: {} as TTemplateStepCreate["hkjTemplate"],
};
const templateStepSchema = templateStepValidation.templateStepSchema.omit([
	"id",
]);

const AddTemplateStepForm: React.FC<{}> = () => {
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: initValue,
		resolver: yupResolver(templateStepSchema),
	});
	console.log("🚀 ~ errors:", errors);
	const message = App.useApp().message;
	const { templateUpdate } = templateStore();

	const { setToggleRefreshStep } = templateStepStore();

	const { data, mutate, isPending } = useMutation({
		mutationFn: (data: TForm) => templateStepService.create(data),
		onSuccess(data, variables, context) {
			message.success("Đã tạo bảng bảng mẫu thành công");
			setValue("name", "");
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
		onSettled() {
			setToggleRefreshStep();
		},
	});

	useEffect(() => {
		setValue("hkjTemplate", {
			id: templateUpdate?.id!,
		});
	}, [templateUpdate]);
	return (
		<Form
			layout="vertical"
			onFinish={handleSubmit((data) => mutate(data))}
			className="grid grid-cols-10  gap-2 items-center"
		>
			<div className="col-span-9">
				<InputCustom
					control={control}
					label="Bước thực hiện"
					name="name"
					type="textarea"
					className="w-full"
					placeholder="Nhập bước thực hiện"
					errorMessage={errors.name?.message}
					suffix="Vui lóng nhập bước thực hiện"
					rows={2}
				/>
			</div>
			<div className="col-span-1 flex justify-end">
				<Button
					type="primary"
					htmlType="submit"
					loading={isPending}
					shape="circle"
					size="small"
					icon={<Plus size={18} />}
				></Button>
			</div>
		</Form>
	);
};

export default AddTemplateStepForm;
