import { Select, Space } from "antd";
import { SelectProps } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import categoryService from "@/services/categoryService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { TCategory } from "@/types";

const SelectCategoryForm: React.FC<SelectProps & { errorMessage?: string }> = ({
	onChange,
	errorMessage,
	...props
}) => {
	console.log("🚀 ~ errorMessage:", errorMessage);
	const [data, setData] = useState<SelectProps["options"]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [query] = useState({ page: 0, size: 100 });

	// Using useQuery to fetch categories once
	const { data: categories, isLoading: isLoadingCategories } = useQuery({
		queryKey: ["categories", query],
		queryFn: () => categoryService.get(query),
		onSuccess: (response: TCategory[]) => {
			const options = response.map((item) => ({
				value: item.id,
				label: item.name,
			}));
			setData((prev) => [...prev!, ...options]);
		},
		onError: (error: any) => {
			console.error("Error fetching categories:", error);
		},
		enabled: !data?.length,
	});

	useEffect(() => {
		if (props.defaultValue) {
			setSelected(props.defaultValue as number);
		}
	}, [props.defaultValue]);

	return (
		<Space direction="vertical">
			<LabelCustom label="Loại trang sức" required />
			<Select
				status={errorMessage ? "error" : undefined}
				size="large"
				style={{ width: "100%" }}
				placeholder="Chọn loại trang sức"
				onChange={(value, option) => {
					setSelected(value as number);
					if (onChange) onChange(value, option);
				}}
				disabled={isLoadingCategories}
				options={data}
				value={isLoadingCategories ? "Đang tải..." : selected}
				loading={isLoadingCategories}
				{...props}
			/>
			<span className="text-red-500">{errorMessage}</span>
		</Space>
	);
};

export default SelectCategoryForm;
