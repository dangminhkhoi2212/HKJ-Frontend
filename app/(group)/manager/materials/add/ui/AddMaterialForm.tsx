"use client";
import { App, Button, Form, Space, UploadFile } from 'antd';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useRouterCustom } from '@/hooks';
import { materialImageService, materialService } from '@/services';
import supabaseService from '@/services/supabaseService';
import { InputCustom, LabelCustom } from '@/shared/FormCustom/InputCustom';
import { InputImage } from '@/shared/FormCustom/InputImage';
import { TMaterial } from '@/types';
import materialValidation from '@/validations/materialValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

const items = [
	{
		title: "Điền thông tin",
	},
	{
		title: "Chọn hình ảnh",
	},
	{
		title: "Kết quả",
	},
];
type TForm = Omit<TMaterial, "coverImage" | "id"> & {
	coverImage: UploadFile[];
};
const initValueForm: TForm = {
	name: "",
	coverImage: [],
};

const excludeIdSchema = materialValidation.materialSchema.omit(["id"]);
const AddMaterialForm: React.FC<{}> = () => {
	const { message } = App.useApp();
	const [form] = Form.useForm();
	const [images, setImages] = useState<UploadFile[]>([]);
	const [coverImage, setCoverImage] = useState<UploadFile[]>([]);
	const [current, setCurrent] = useState(0);
	const { router } = useRouterCustom();

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

	const createMaterial = async (data: Omit<TMaterial, "images" | "id">) => {
		return await materialService.create({ ...data });
	};

	const handleImageChange = useCallback(
		(fileList: UploadFile[]) => {
			setValue("coverImage", fileList, { shouldValidate: true });
		},
		[setValue]
	);

	const uploadImageToCloud = async (
		images: UploadFile[],
		folder: string
	): Promise<string[]> => {
		// upload in storage supabse

		const imagesUploaded = await Promise.all(
			images.map(async (item) => {
				const file = new File([item.originFileObj!], item.name, {
					type: item.type,
				});
				return await supabaseService.uploadFile(file, folder);
			})
		);
		return imagesUploaded.map((item) => item.publicUrl);
	};

	const createImageInDatabase = async (
		images: string[],
		materialId: number
	) => {
		const imageConvert: any[] = images.map((item) => {
			return {
				url: item,
				material: { id: materialId },
			};
		});

		await Promise.all(
			imageConvert.map(async (item) => {
				await materialImageService.create(item);
			})
		);
	};
	const handleUploadCoverImage = async (
		materialId: string
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
			const material = await materialService.create({
				...data,
				coverImage: "",
			});
			const imageCover = await handleUploadCoverImage(material.id);
			const updateMaterial = await materialService.update({
				...material,
				coverImage: imageCover,
			});
			return updateMaterial;
		},
		onSuccess: () => {
			message.success("Tạo nguyên liệu thành công");
			resetForm();
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error("Tạo thất bại vui lòng thử lại");
		},
	});
	const resetForm = () => {
		reset(initValueForm);
	};

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
							images={coverImage}
							maxCount={1}
						/>
						<span className="text-red-500">
							{errors?.coverImage?.message?.toString() ?? ""}
						</span>
					</Space>
				</div>
				<div>
					<Button htmlType="submit" type="primary">
						Thêm chất liệu
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default AddMaterialForm;
