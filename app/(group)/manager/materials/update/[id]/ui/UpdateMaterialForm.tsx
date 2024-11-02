"use client";
import { App, Button, Form, Space, UploadFile } from 'antd';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { KEY_CONST } from '@/const';
import { materialService } from '@/services';
import supabaseService from '@/services/supabaseService';
import { InputCustom, LabelCustom } from '@/shared/FormCustom/InputCustom';
import { InputImage } from '@/shared/FormCustom/InputImage';
import { TMaterial } from '@/types';
import { imageUtil } from '@/utils';
import materialValidation from '@/validations/materialValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

type TForm = Omit<TMaterial, "coverImage"> & {
	coverImage: UploadFile[];
};
const initValueForm: TForm = {
	id: 0,
	name: "",
	coverImage: [],
};
const { convertToUploadFile } = imageUtil;

const excludeIdSchema = materialValidation.materialSchema;
const UpdateMaterial: React.FC<{ id: string }> = ({ id }) => {
	const { message } = App.useApp();
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
	});
	useEffect(() => {
		if (material) {
			setValue("id", material.id);
			setValue("name", material.name);
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
	const createMaterialMutation = useMutation({
		mutationFn: async (data: TForm) => {
			const imageCover = await handleUploadCoverImage(data.id);
			const updateMaterial = await materialService.update({
				...material,
				coverImage: imageCover!,
			});
			return updateMaterial;
		},
		onSuccess: () => {
			message.success("Cập nhật thành công");
		},
		onError(error) {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});

	return (
		<div>
			<Form
				form={form}
				layout="vertical"
				className="flex flex-col gap-5"
				onFinish={handleSubmit((data) =>
					createMaterialMutation.mutate(data)
				)}
			>
				<InputCustom
					name="name"
					control={control}
					label="Chất liệu"
					placeholder={"Chất liệu"}
					errorMessage={errors.name?.message}
					className="w-full max-w-44"
				/>
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
				<div>
					<Button htmlType="submit" type="primary">
						Cập nhật
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default UpdateMaterial;
