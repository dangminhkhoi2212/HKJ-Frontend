"use client";
import { App, Button, Form, Modal, Space, UploadFile } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import yup from "yup";

import { KEY_CONST } from "@/const";
import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { materialService } from "@/services";
import supabaseService from "@/services/supabaseService";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { imageUtil } from "@/utils";
import materialValidation from "@/validations/materialValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";

const schema = materialValidation.materialSchema;

type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];
const initValueForm: TForm = {
	id: 0,
	name: "",
	coverImage: [],
	unit: "",
	pricePerUnit: 0,
	isDeleted: false,
};

const { convertToUploadFile } = imageUtil;

const excludeIdSchema = materialValidation.materialSchema;
const UpdateMaterial: React.FC<{ id: string }> = ({ id }) => {
	const { message } = App.useApp();
	const [showModal, setShowModal] = useState<boolean>(false);
	const router = useRouterCustom().router;
	const [form] = Form.useForm();

	const {
		getValues,
		control,
		handleSubmit,
		trigger,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<TForm>({
		resolver: yupResolver(excludeIdSchema),
		mode: "onChange",
		defaultValues: initValueForm,
	});

	const {
		data: material,
		refetch: getMaterial,
		isLoading,
	} = useQuery({
		queryKey: ["material", id],
		queryFn: () => materialService.getOne(id),
		enabled: !!id,
		staleTime: 0,
	});
	useEffect(() => {
		if (material) {
			reset({ ...material, coverImage: [] });
			setValue(
				"coverImage",
				material.coverImage
					? [convertToUploadFile({ url: material.coverImage })]
					: []
			);
		}
	}, [material, getMaterial]);

	const handleImageChange = useCallback(
		(fileList: UploadFile[]) => {
			setValue("coverImage", fileList, { shouldValidate: true });
		},
		[setValue]
	);

	const handleUploadCoverImage = async (
		materialId: string | number
	): Promise<string | null> => {
		const coverImage: UploadFile | undefined = getValues("coverImage")[0];
		if (!coverImage?.url) {
			// if cover have not url => new cover image file
			const folder = supabaseService.createCoverFolder(
				"materials",
				materialId
			);

			const [coverImageUrl] = await Promise.all([
				await supabaseService.uploadAnDelete(
					[],
					[supabaseService.convertFile(coverImage!)],
					folder
				),
			]);
			return coverImageUrl[0];
		}

		return null;
	};
	const updateMaterialMutation = useMutation({
		mutationFn: async (data: TForm) => {
			const imageCover = await handleUploadCoverImage(data.id);
			const updateMaterial = await materialService.update({
				...data,
				coverImage: imageCover!,
			});
			return updateMaterial;
		},
		onSuccess: () => {
			message.success("Cập nhật thành công");
			router.push(routesManager.material);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	const handleDelete = useMutation({
		mutationFn: () =>
			materialService.update({ ...material, isDeleted: true }),
		onSuccess: () => {
			message.success(`Đã xóa chất liệu ${material?.name} thành công`);
			router.push(routesManager.material);
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	return (
		<div>
			<Modal
				open={showModal}
				onCancel={() => setShowModal(false)}
				onOk={() => handleDelete.mutate()}
				okButtonProps={{
					loading: handleDelete.isPending,
					type: "primary",
					danger: true,
				}}
				cancelButtonProps={{ disabled: handleDelete.isPending }}
				title="Xóa chất liệu"
			>
				<p>
					Bạn có muốn xóa chất liệu{" "}
					<span className="font-semibold">{material?.name}</span>
				</p>
			</Modal>
			<Form
				form={form}
				layout="vertical"
				className="flex flex-col gap-5"
				onFinish={handleSubmit((data) =>
					updateMaterialMutation.mutate(data)
				)}
			>
				<InputCustom
					name="name"
					control={control}
					label="Chất liệu"
					placeholder={"Chất liệu"}
					errorMessage={errors.name?.message}
					className="w-full max-w-44"
					disabled
				/>
				<InputCustom
					name="unit"
					control={control}
					placeholder={"Đơn vị"}
					label="Đơn vị"
					className="w-full max-w-44"
					disabled
				/>
				<InputNumberCustom
					name="pricePerUnit"
					control={control}
					label="Giá mỗi đơn vị"
					className="w-full max-w-44"
				/>
				<NumberToWords number={watch("pricePerUnit")} />

				<div className="">
					<Space direction="vertical">
						<LabelCustom label="Ảnh bìa" required />
						<InputImage
							onChange={(fileList) => handleImageChange(fileList)}
							images={watch("coverImage")}
							maxCount={1}
						/>
						<span className="text-red-500">
							{errors?.coverImage?.message?.toString() ?? ""}
						</span>
					</Space>
				</div>
				<Space>
					<Button
						danger
						type="primary"
						onClick={() => setShowModal(true)}
					>
						Xóa
					</Button>
					<Button
						htmlType="submit"
						type="primary"
						loading={updateMaterialMutation.isPending}
					>
						Cập nhật
					</Button>
				</Space>
			</Form>
		</div>
	);
};

export default UpdateMaterial;
