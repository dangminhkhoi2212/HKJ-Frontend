"use client";
import { App, Button, Form, Space } from "antd";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { KEY_CONST } from "@/const";
import categoryService from "@/services/categoryService";
import { InputCustom } from "@/shared/FormCustom/InputCustom";
import { TCategory } from "@/types";
import categoryValidation from "@/validations/categoryValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import categoryStore from "../store";

type TProps = {};
type TForm = Omit<TCategory, "id">;
const initValue: TForm = {
	name: "",
};
const CreateCategoryForm: React.FC<TProps> = () => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: initValue,
		resolver: yupResolver(categoryValidation.categorySchema),
	});

	const message = App.useApp().message;
	const {
		setToggleRefresh,
		setOpenDrawer,
		openDrawer,
		categoryUpdate,
		setCategoryUpdate,
	} = categoryStore();

	const {
		data,
		mutate: create,
		isPending: createLoading,
	} = useMutation({
		mutationFn: (data: TForm) => categoryService.create(data),
		onSuccess: (data) => {
			message.success("Đã thêm phân loại");
			setToggleRefresh();
			setOpenDrawer(false);
			reset(initValue);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	const {
		data: _,
		mutate: update,
		isPending: updateLoading,
	} = useMutation({
		mutationFn: (data: TForm) =>
			categoryService.update({ ...data, id: categoryUpdate.id }),
		onSuccess: (data) => {
			message.success("Đã cập nhật thành công");
			setToggleRefresh();
			setOpenDrawer(false);
			reset(initValue);
			setCategoryUpdate({} as TCategory);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	const handleCreate = (data: TForm) => {
		categoryUpdate.id ? update(data) : create(data);
	};

	useEffect(() => {
		if (!categoryUpdate.id) {
			reset(initValue);
		}
	}, [openDrawer]);

	useEffect(() => {
		if (categoryUpdate.id) {
			reset(categoryUpdate);
		}
	}, [categoryUpdate]);
	return (
		<Form onFinish={handleSubmit(handleCreate)} layout="vertical">
			<Space direction="vertical" className="flex flex-col">
				<InputCustom
					control={control}
					name="name"
					label="Tên phân loại"
					placeholder="Tên phân loại"
					errorMessage={errors.name?.message}
				/>
				<div className="flex justify-end">
					<Button
						htmlType="submit"
						type="primary"
						size="large"
						loading={createLoading || updateLoading}
					>
						{categoryUpdate.id ? "Cập nhật" : "Tạo"}
					</Button>
				</div>
			</Space>
		</Form>
	);
};

export default CreateCategoryForm;
