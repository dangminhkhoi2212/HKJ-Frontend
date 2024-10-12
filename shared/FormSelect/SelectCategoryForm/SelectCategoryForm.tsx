"use client";
import { Select, Space } from "antd";
import { SelectProps } from "antd/lib";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { useQuery } from "react-query";

import categoryService from "@/services/categoryService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { TCategory } from "@/types";

const SelectCategoryForm: React.FC<
	SelectProps & { errorMessage?: string; name: string; control: Control<any> }
> = ({ errorMessage, name, control, ...props }) => {
	const [data, setData] = useState<SelectProps["options"]>([]);
	const [query] = useState({ page: 0, size: 100 });

	// Using useQuery to fetch categories once
	const { data: categories, isLoading: isLoadingCategories } = useQuery({
		queryKey: ["categories", query],
		queryFn: () => categoryService.get(query),
		onSuccess: (response: TCategory[]) => {
			const options: { value: number; label: string }[] = response.map(
				(item) => ({
					value: item.id,
					label: item.name,
				})
			);
			setData((prev) => [...prev!, ...options]);
		},
		onError: (error: any) => {
			console.error("Error fetching categories:", error);
		},
		enabled: !data?.length,
	});

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Space direction="vertical">
					<LabelCustom label="Loại trang sức" required />
					<Select
						status={fieldState.invalid ? "error" : undefined}
						size="large"
						style={{ width: "100%" }}
						placeholder="Chọn loại trang sức"
						onChange={(value, option) => {
							field.onChange({
								id: value,
								name: data?.find((item) => item.value === value)
									?.label,
							});
						}}
						disabled={isLoadingCategories}
						options={data}
						value={field.value?.id}
						loading={isLoadingCategories}
						{...props}
					/>
					<span className="text-red-500">{errorMessage}</span>
				</Space>
			)}
		/>
	);
};

export default SelectCategoryForm;
