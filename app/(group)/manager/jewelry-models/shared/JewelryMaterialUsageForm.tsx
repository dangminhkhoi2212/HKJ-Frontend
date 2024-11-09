import { Button, Divider, Space, Tag, Tooltip } from "antd";
import { Minus } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import {
	InputNumberCustom,
	LabelCustom,
} from "@/shared/FormCustom/InputCustom";
import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { SelectMaterialForm } from "@/shared/FormSelect";
import { useIsFirstRender } from "@uidotdev/usehooks";

type Props = {};
type TForm = {
	materials: {
		id: number;
		material: {
			id?: number;
			unit: string;
			pricePerUnit: number;
		};
		jewelry: {
			id: number;
		} | null;
		usage: number;
		price: number;
	}[];
	price: number;
};

const JewelryMaterialUsageForm: React.FC<Props> = () => {
	const isFirstRender = useIsFirstRender();
	const {
		control,
		setValue,
		watch,
		formState: { errors },
		getValues,
	} = useFormContext<TForm>();

	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "materials",
	});

	const materials = useWatch({ control, name: "materials" }) || [];
	const price = useWatch({ control, name: "price" }) || 0;

	const handleOnChangeMaterial = useCallback(
		(value: number, option: any, index: number, field: any) => {
			update(index, {
				...field,
				id: typeof field.id !== "number" ? null : field.id,
				material: {
					id: value,
					unit: option.unit || "gram",
					pricePerUnit: Number(option.pricePerUnit) || 0,
				},
				usage: 0,
				price: 0,
			});
			// setValue(`materials.${index}.material.id`, value, {});
			// setValue(`materials.${index}.material.unit`, option.unit || "gram");
			// setValue(
			// 	`materials.${index}.material.pricePerUnit`,
			// 	Number(option.pricePerUnit) || 0
			// );
			// setValue(`materials.${index}.usage`, 0, {}); // Reset usage when material changes
		},
		[setValue]
	);

	const handleUsageChange = useCallback(
		(index: number, value: any, field: any) => {
			const pricePerUnit = getValues(
				`materials.${index}.material.pricePerUnit`
			);
			const price = value.floatValue! * pricePerUnit;

			setValue(`materials.${index}.price`, price);
		},
		[getValues, update]
	);

	useEffect(() => {
		if (materials.length === 0) return;

		const totalPrice = materials.reduce((total, field) => {
			const materialPrice = field.material.pricePerUnit || 0;
			const usage = field.usage || 0;
			return total + materialPrice * usage;
		}, 0);

		setValue("price", totalPrice);
	}, [materials, setValue]);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<LabelCustom label="Chất liệu" required />
				<Tag color="red">Sử dụng dấu . cho phần thập phân</Tag>
			</div>

			{fields.map((field, index) => {
				// console.log("🚀 ~ {fields.map ~ field:", field);

				return (
					<Space
						key={field.id}
						align="end"
						className="items-end w-full"
					>
						<div className="grid grid-cols-3 gap-3 items-start">
							<div className="flex flex-col justify-end">
								<div className="flex gap-2 items-start col-span-1">
									<Tooltip title="Xóa chất liệu">
										<Button
											shape="circle"
											disabled={fields.length === 1}
											icon={<Minus />}
											onClick={() => remove(index)}
											danger
										/>
									</Tooltip>
									<SelectMaterialForm
										key={field.id}
										hasLabel={false}
										value={field?.material?.id || null}
										onChange={(value, option) =>
											handleOnChangeMaterial(
												value,
												option,
												index,
												field
											)
										}
										status={
											errors?.materials?.[index]?.material
												?.id
												? "error"
												: ""
										}
										className="w-full"
									/>
								</div>
								<div>
									<span className="text-red-400">
										{
											errors?.materials?.[index]?.material
												?.id?.message
										}
									</span>
								</div>
							</div>

							<InputNumberCustom
								control={control}
								name={`materials.${index}.usage`}
								className="w-full col-span-1"
								suffix={` ${field?.material?.unit || "gram"}`}
								onValueChange={(value) =>
									handleUsageChange(index, value, field)
								}
								disabled={!field?.material?.id}
							/>

							<InputNumberCustom
								control={control}
								name={`materials.${index}.price`}
								className="w-full col-span-1"
								decimalScale={3}
								readOnly
								disabled={!field?.material?.id}
							/>
						</div>
					</Space>
				);
			})}

			<div>
				<Button
					type="dashed"
					onClick={() =>
						append({
							id: 0,
							material: { id: 0, unit: "", pricePerUnit: 0 },
							jewelry: null,
							usage: 0,
							price: 0,
						})
					}
				>
					Thêm
				</Button>
			</div>
			<Divider className="my-2" />

			<div className="flex flex-col gap-2 items-end justify-end">
				<InputNumberCustom
					control={control}
					name="price"
					className="w-full col-span-1"
					label="Giá tổng"
				/>
				<NumberToWords number={price} />
			</div>
		</div>
	);
};

export default JewelryMaterialUsageForm;
