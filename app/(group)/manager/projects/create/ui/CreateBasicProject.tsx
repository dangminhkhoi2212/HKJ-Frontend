"use client";
import { App, Button, Form, Space, Tag } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import { routesManager } from "@/routes";
import projectService from "@/services/projectService";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectStatusForm } from "@/shared/FormSelect";
import { TProject, TProjectCreate, TStatus } from "@/types";
import { TPriority } from "@/types/priorityType";
import { tagMapperUtil } from "@/utils";
import projectValidation from "@/validations/projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

const { TPriorityMapper, TStatusMapper } = tagMapperUtil;
const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});

const { projectSchema } = projectValidation;
type Props = {};
const schema = projectSchema.omit(["id", "coverImage", "jewelry"]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValue: TForm = {
	name: "",
	description: "",
	date: {
		startDate: dayjs().hour(0).toISOString(),
		endDate: dayjs().add(2, "week").hour(23).toISOString(),
	},
	expectDate: dayjs().add(2, "week").hour(23).toISOString(),
	priority: TPriority.MEDIUM,
	notes: "",
	status: TStatus.IN_PROCESS,
	manager: { id: 0 },
};

const CreateBasicProject: React.FC<Props> = ({}) => {
	const message = App.useApp().message;
	const account = useAccountStore((state) => state.account);
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: { ...initValue, manager: { id: account?.id } },
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (account) {
			setValue("manager.id", account?.id!);
		}
	}, [account]);
	const { router } = useRouterCustom();
	console.log("🚀 ~ errors:", errors);

	const { data, mutate, isPending } = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TProjectCreate = {
				...data,
				coverImage: "",
				startDate: dayjs(data.date.startDate).toISOString(),
				endDate: dayjs(data.date.endDate).toISOString(),
			};
			return projectService.create(dataConvert);
		},
		onSuccess(data: TProject) {
			message.success("Đã tạo dự án");
			router.push(routesManager.updateProject(data.id));
		},
		onError(data) {
			console.log("🚀 ~ onError ~ data:", data);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	return (
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
						extra={
							<Tag color="green" className="text-wrap my-2">
								Có thể sử dụng mã đơn hàng để đặt tên giúp dễ
								dàng tìm kiếm
							</Tag>
						}
					/>
					<InputCustom
						control={control}
						name="date"
						label="Thời gian dự án"
						type="rangeDate"
						className="w-60"
						errorMessage={errors?.date?.message}
					/>

					{/* <InputCustom
						control={control}
						name="expectDate"
						label="Thời gian mong đợi hoàn thành"
						type="date"
						className="w-60"
						errorMessage={errors?.expectDate?.message}
					/> */}
				</Space>
				<Space direction="vertical" className="flex" size={"large"}>
					<Space direction="vertical">
						<LabelCustom label="Trạng thái" />
						<SelectStatusForm
							size="large"
							className="w-40"
							defaultValue={TStatus.IN_PROCESS}
							onChange={(value) => setValue("status", value)}
							ignoreStatus={[
								TStatus.CANCEL,
								TStatus.DELIVERED,
								TStatus.NEW,
							]}
						/>
					</Space>

					<InputCustom
						control={control}
						required={false}
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
				<Button type="primary" htmlType="submit" loading={isPending}>
					Tạo
				</Button>
			</div>
		</Form>
	);
};

export default CreateBasicProject;
