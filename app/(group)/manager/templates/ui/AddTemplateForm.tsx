import { App, Button, Form, Space, Tag } from "antd";
import React from "react";
import { useForm } from "react-hook-form";

import { KEY_CONST } from "@/const";
import templateService from "@/services/templateService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { TTemplateCreate } from "@/types";
import templateValidation from "@/validations/templateValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { templateStore } from "../store";

type TForm = TTemplateCreate;

const initValue: TForm = {
	name: "",
	category: {} as TTemplateCreate["category"],
};
const templateSchema = templateValidation.templateSchema.omit(["id"]);
const AddTemplateForm: React.FC<{}> = () => {
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: initValue,
		resolver: yupResolver(templateSchema),
	});
	console.log("🚀 ~ errors:", errors);
	const message = App.useApp().message;
	const { setToggleRefresh, openDrawer, setTemplateUpdate } = templateStore();
	const onChangeSelect = (caterogyId: number) => {
		setValue("category.id", caterogyId, { shouldValidate: true });
	};

	const { data, mutate, isPending } = useMutation({
		mutationFn: (data: TForm) => templateService.create(data),
		onSuccess(data, variables, context) {
			message.success("Đã tạo bảng bảng mẫu thành công");
			setTemplateUpdate(data);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<Form
			layout="vertical"
			onFinish={handleSubmit((data) => mutate(data))}
			className="flex flex-col gap-4"
		>
			<Tag className="text-wrap" color="blue">
				Sau khi tạo bản mẫu bạn có thể tạo các bước để tiện cho quá
				trình triển khai dự án
			</Tag>
			<Space direction="vertical" className="w-full" size={"middle"}>
				<InputCustom
					control={control}
					label="Tên bảng mẫu"
					name="name"
					className="w-full"
					placeholder="Nhập tên bảng mẫu"
					errorMessage={errors.name?.message}
				/>
				<Space direction="vertical" className="w-full">
					<SelectCategoryForm
						control={control}
						name="category"
						onChange={onChangeSelect}
						key={openDrawer.toString()}
					/>
					<span className="text-red-500">
						{errors.category?.id?.message}
					</span>
				</Space>
				<div className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						loading={isPending}
					>
						Tạo
					</Button>
				</div>
			</Space>
		</Form>
	);
};

export default AddTemplateForm;
