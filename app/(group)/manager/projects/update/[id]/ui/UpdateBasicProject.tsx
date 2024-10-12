"use client";
import { App, Button, Form, Space, Spin, Tag } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { TProject, TProjectUpdate, TStatus, TStatusMapper } from "@/types";
import { TPriority, TPriorityMapper } from "@/types/priorityType";
import projectValidation from "@/validations/projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateProjectStore } from "../store";

const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});

const { projectSchema } = projectValidation;
type Props = {};
const schema = projectSchema.omit(["coverImage"]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValue: TForm = {
	id: 0,
	name: "",
	description: "",
	date: {
		startDate: dayjs().toISOString(),
		endDate: dayjs().add(1, "week").toISOString(),
	},
	expectDate: dayjs().add(1, "week").toISOString(),
	priority: TPriority.MEDIUM,
	budget: 0,
	actualCost: 0,
	qualityCheck: false,
	notes: "",
	status: TStatus.NEW,
	category: { id: 0, name: "" },
	jewelry: { id: null, name: "" },
};
const convertDataToForm = (data: TProject) => {
	return {
		...data,
		date: {
			startDate: data.startDate,
			endDate: data.endDate,
		},
	};
};
const UpdateBasicProject: React.FC<Props> = ({}) => {
	const { projectId: id, project } = updateProjectStore();
	const message = App.useApp().message;
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: convertDataToForm(project!),
		resolver: yupResolver(schema),
	});
	console.log("🚀 ~ errors:", errors);
	const { router } = useRouterCustom();

	const {
		data,
		mutate,
		isLoading: isLoadingUpdate,
	} = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TProjectUpdate = {
				...data,
				coverImage: "",
				startDate: data.date.startDate,
				endDate: data.date.endDate,
			};
			if (!data.jewelry.id) delete dataConvert.jewelry;
			return projectService.update(dataConvert);
		},
		onSuccess(data: TProject) {
			message.success("Đã cập nhật dự án");
			router.push(routesManager.updateProject(data.id));
		},
		onError(data) {
			console.log("🚀 ~ onError ~ data:", data);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<Spin spinning={isLoadingUpdate}>
			<Form
				className="flex flex-col gap-5 "
				layout="vertical"
				onFinish={handleSubmit((data) => mutate(data))}
			>
				<div className="grid grid-cols-2 gap-6">
					<Space direction="vertical" className="flex" size={"large"}>
						<InputCustom
							control={control}
							name="name"
							label="Tên dự án"
							placeholder="Tên dự án"
							errorMessage={errors?.name?.message}
						/>
						<InputCustom
							control={control}
							name="date"
							label="Thời gian dự án"
							type="rangeDate"
							errorMessage={errors?.date?.message}
						/>

						<InputCustom
							control={control}
							name="expectDate"
							label="Thời gian mong đợi hoàn thành"
							type="date"
							errorMessage={errors?.expectDate?.message}
						/>
						<InputNumberCustom
							control={control}
							name="budget"
							label="Ngân sách"
							toWords
							className="w-52"
							errorMessage={errors?.expectDate?.message}
						/>
						<InputNumberCustom
							control={control}
							name="actualCost"
							label="Giá trị thực tế sản phẩm"
							toWords
							className="w-52"
							errorMessage={errors?.expectDate?.message}
							extra={
								<Tag color="green" className="text-wrap my-2">
									Bạn có thể cập nhật sau khi hoàn thành dự án
								</Tag>
							}
						/>
					</Space>
					<Space direction="vertical" className="flex" size={"large"}>
						<InputCustom
							control={control}
							name="status"
							label="Trạng thái"
							type="select"
							defaultValue={TStatus.NEW}
							options={Object.entries(TStatus).map(
								([key, value]) => ({
									label: TStatusMapper(value),
									value: key,
								})
							)}
							className="w-40"
							errorMessage={errors?.status?.message}
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
							errorMessage={errors?.priority?.message}
						/>

						<SelectCategoryForm
							control={control}
							name="category"
							errorMessage={
								errors?.category?.message ||
								errors?.category?.id?.message
							}
						/>
					</Space>
				</div>
				<div>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<Space direction="vertical" className="flex">
								<LabelCustom label="Mô tả" />
								<ReactQuill
									value={field.value}
									onChange={field.onChange}
								/>
							</Space>
						)}
					/>
				</div>
				<div className="flex justify-end">
					<Button
						type="primary"
						htmlType="submit"
						loading={isLoadingUpdate}
					>
						Cập nhật
					</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default UpdateBasicProject;
