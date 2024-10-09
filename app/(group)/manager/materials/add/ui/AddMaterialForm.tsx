"use client";
import {
	App,
	Button,
	Divider,
	Form,
	Result,
	Space,
	Steps,
	UploadFile,
} from "antd";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useMutation } from "react-query";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { materialImageService, materialService } from "@/services";
import supabaseService from "@/services/supabaseService";
import {
	InputCustom,
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import { InputImage } from "@/shared/FormCustom/InputImage";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { TMaterial } from "@/types";
import materialValidation from "@/validations/materialValidation";
import { yupResolver } from "@hookform/resolvers/yup";

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
	images: UploadFile[];
};
const initValueForm: TForm = {
	name: "",
	unit: "",
	unitPrice: 0,
	quantity: 0,
	supplier: "",
	coverImage: [],
	images: [],
};
export const extraUnitPrice = ({
	unitPrice,
	unit,
}: {
	unitPrice: number;
	unit: string;
}) => {
	return (
		(unitPrice || unit) && (
			<span>
				{
					<NumericFormat
						readOnly
						value={unitPrice}
						displayType="text"
						suffix=" VND"
						thousandSeparator=","
					/>
				}
				/{unit}
			</span>
		)
	);
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
	console.log("🚀 ~ AddMaterialForm ~ errors:", errors);
	const next = () => {
		setCurrent(current + 1);
	};
	const handleNext = async () => {
		if (
			await trigger(["name", "unit", "unitPrice", "quantity", "supplier"])
		)
			next();
	};

	const prev = () => {
		setCurrent(current - 1);
	};
	const createMaterial = async (data: Omit<TMaterial, "images" | "id">) => {
		return await materialService.create({ ...data });
	};

	const handleImageChange = useCallback(
		(fileList: UploadFile[], fieldName: "images" | "coverImage") => {
			setValue(fieldName, fileList, { shouldValidate: true });
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
	const handleCreateMaterial = async (data: TForm) => {
		const { images: imagesData, coverImage, ...rest } = data;
		console.log("🚀 ~ handleCreateMaterial ~ data:", data);
		// // create material in database

		let material: TMaterial = await createMaterial({
			...rest,
			coverImage: "",
		});
		const folderCoverImage = supabaseService.createCoverFolder(
			"materials",
			material.id
		);
		const folderImage = supabaseService.createImagesFolder(
			"materials",
			material.id
		);

		// upload cover image to cloud
		const coverImageUrl = (
			await uploadImageToCloud(coverImage, folderCoverImage)
		)[0]!;

		// // update material in database

		let materialUpdate: TMaterial = await materialService.update({
			...material,
			coverImage: coverImageUrl,
		});

		// upload image to cloud to get urls
		const imageUrls: string[] = await uploadImageToCloud(
			imagesData,
			folderImage
		);

		// // create image in database

		await createImageInDatabase(imageUrls, material.id);
	};

	const createMaterialMutation = useMutation({
		mutationFn: (data: TForm) => handleCreateMaterial(data),
		onSuccess: () => {
			message.success("Tạo nguyên liệu thành công");
			resetForm();
			next();
		},
		onError(error) {
			console.log("🚀 ~ onError ~ error:", error);
			message.error("Tạo thất bại vui lòng thử lại");
		},
	});
	const resetForm = () => {
		const { images, ...rest } = initValueForm;
		const imagesForm = getValues("images");
		reset(rest);
		setValue("images", imagesForm);
	};

	const steps = [
		{
			key: "1",
			children: (
				<div className="grid grid-cols-2 gap-8">
					<Space direction="vertical">
						<InputCustom
							control={control}
							name="name"
							label="Tên loại nguyên liệu"
							errorMessage={errors.name?.message}
						/>
						<InputNumberCustom
							control={control}
							name="quantity"
							label="Số lượng nhập"
							max={1000000}
							min={0}
							errorMessage={errors.quantity?.message}
						/>
						<InputCustom
							control={control}
							name="unit"
							label="Đơn vị"
							errorMessage={errors.unit?.message}
						/>
					</Space>

					<Space direction="vertical">
						<div>
							<InputNumberCustom
								control={control}
								name="unitPrice"
								suffix=" VND"
								label="Giá mỗi đơn vị"
								defaultValue={0}
								extra={
									<Space direction="vertical" size={"small"}>
										<NumberToWords
											number={getValues("unitPrice")}
										/>
										<span>Ví dụ: 500,000/ gam</span>
										{extraUnitPrice({
											unit: watch("unit"),
											unitPrice: watch("unitPrice"),
										})}
									</Space>
								}
								errorMessage={errors.unitPrice?.message}
							/>
						</div>
						<InputCustom
							control={control}
							name="supplier"
							label="Nhà cung cấp"
							errorMessage={errors.supplier?.message}
						/>
					</Space>
				</div>
			),
		},
		{
			key: "2",
			children: (
				<div className="">
					<Space direction="vertical">
						<LabelCustom label="Ảnh bìa" required />
						<InputImage
							onChange={(fileList) =>
								handleImageChange(fileList, "coverImage")
							}
							images={coverImage}
							maxCount={1}
						/>
						<span className="text-red-500">
							{errors?.coverImage?.message?.toString() ?? ""}
						</span>
					</Space>
					<Divider className="my-2" />
					<Space direction="vertical">
						<LabelCustom label="Hình ảnh" required />
						<InputImage
							onChange={(fileList) =>
								handleImageChange(fileList, "images")
							}
							images={images}
							maxCount={5}
						/>
						<span className="text-red-500">
							{errors?.images?.message?.toString() ??
								errors?.images?.message?.toString() ??
								""}
						</span>
					</Space>
				</div>
			),
		},
		{
			Key: "3",
			children: (
				<Result
					status="success"
					title="Đã thêm thành công"
					extra={[
						<Button
							type="dashed"
							key="1"
							onClick={() => goToNewForm()}
						>
							Thêm sản phẩm mới
						</Button>,
						<Button
							type="primary"
							key="2"
							onClick={() => router.push(routesManager.material)}
						>
							Tới trang chất liệu
						</Button>,
					]}
				/>
			),
		},
	];
	const goToNewForm = () => {
		reset(initValueForm);
		setImages([]);
		setCurrent(0);
	};

	return (
		<div>
			<Steps current={current} items={items} />
			<Form
				form={form}
				layout="vertical"
				className=""
				onFinish={handleSubmit((data) =>
					createMaterialMutation.mutate(data)
				)}
			>
				<div className="my-6">{steps[current].children!}</div>
				<Space className="flex justify-end">
					{current < steps.length - 2 && (
						<Space>
							<Button type="default" onClick={resetForm}>
								Xóa dữ liệu
							</Button>
							<Button type="primary" onClick={() => handleNext()}>
								Kế tiếp
							</Button>
						</Space>
					)}
					{current > 0 && current <= steps.length - 2 && (
						<Button
							style={{ margin: "0 8px" }}
							onClick={() => prev()}
							disabled={createMaterialMutation.isLoading}
						>
							Quay lại
						</Button>
					)}
					{current === steps.length - 2 && (
						<Button
							type="primary"
							htmlType="submit"
							loading={createMaterialMutation.isLoading}
						>
							Tạo
						</Button>
					)}
				</Space>
			</Form>
		</div>
	);
};

export default AddMaterialForm;
