"use client";
import { App, Button, Form, Space, Spin } from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { useAccountStore } from "@/providers";
import projectService from "@/services/projectService";
import { InputCustom, LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectStatusForm } from "@/shared/FormSelect";
import { TProject, TProjectUpdate, TStatus } from "@/types";
import { TPriority } from "@/types/priorityType";
import { tagMapperUtil } from "@/utils";
import projectValidation from "@/validations/projectValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { updateProjectStore } from "../store";

const { TPriorityMapper, TStatusMapper } = tagMapperUtil;
const ReactQuill = dynamic(() => import("react-quill-new"), {
	ssr: false,
});

const { projectSchema } = projectValidation;
type Props = {};
const schema = projectSchema.omit(["coverImage", "jewelry"]);
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
	notes: "",
	status: TStatus.NEW,

	manager: { id: 0 },
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
	const {
		projectId: id,
		setProject,
		reset: resetStore,
	} = updateProjectStore();
	const message = App.useApp().message;
	const { params } = useRouterCustom();
	const account = useAccountStore((state) => state.account);

	const {
		control,
		handleSubmit,
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: initValue,
		resolver: yupResolver(schema),
	});
	const {
		data: _,
		mutate,
		isPending: isLoadingUpdate,
	} = useMutation({
		mutationFn: (data: TForm) => {
			const dataConvert: TProjectUpdate = {
				...data,
				coverImage: "",
				startDate: dayjs(data.date.startDate!).toISOString(),
				endDate: dayjs(data.date.endDate!).toISOString(),
			};
			// if (!data.jewelry.id) delete dataConvert.jewelry;
			return projectService.update(dataConvert);
		},
		onSuccess(data: TProject) {
			message.success("Đã cập nhật dự án");
			refetch();
		},
		onError(data) {
			console.log("🚀 ~ onError ~ data:", data);
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	const {
		data: project,
		refetch,
		isPending: isPendingProject,
		isFetching: isFetchingProject,
		isSuccess,
	} = useQuery({
		queryKey: ["project", id],
		queryFn: () => projectService.getOne(params.id),
		enabled: !!params.id,
	});

	useEffect(() => {
		if (isSuccess) {
			console.log("🚀 ~ useEffect ~ data:", project);
			reset({
				...convertDataToForm(project),
				manager: { id: account?.id },
			});
			setProject(project);
		}

		return () => {
			resetStore();
		};
	}, [project, refetch]);

	useEffect(() => {
		setValue("manager.id", account?.id!);
	}, [account]);
	useEffect(() => {
		refetch();
	}, []);

	return (
		<Spin
			spinning={isLoadingUpdate || isPendingProject || isFetchingProject}
		>
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
					</Space>
					<Space direction="vertical" className="flex" size={"large"}>
						<Space direction="vertical">
							<LabelCustom label="Trạng thái" />
							<SelectStatusForm
								size="large"
								className="w-40"
								defaultValue={project?.status}
								value={watch("status")}
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
