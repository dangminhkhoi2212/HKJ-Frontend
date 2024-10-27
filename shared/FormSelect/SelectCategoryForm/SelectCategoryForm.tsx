"use client";
import { Select, Space } from "antd";
import { SelectProps } from "antd/lib";
import React, { useEffect, useState } from "react";

import categoryService from "@/services/categoryService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { TCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

type TProps = SelectProps & {
	hasLabel?: boolean;
	defaultValueId?: number;
};
const SelectCategoryForm: React.FC<TProps> = ({
	hasLabel = true,
	defaultValueId,
	...props
}) => {
	const [data, setData] = useState<SelectProps["options"]>([]);
	const [query] = useState({ page: 0, size: 100 });

	// Using useQuery to fetch categories once
	const {
		data: categories,
		refetch,
		isLoading: isLoadingCategories,
	} = useQuery({
		queryKey: ["categories", query],
		queryFn: () => categoryService.get(query),

		enabled: !data?.length,
	});
	useEffect(() => {
		const options: { value: number; label: string; key: number }[] =
			categories?.map((item: TCategory) => ({
				value: item.id,
				key: item.id,
				label: item.name,
			}));
		console.log("🚀 ~ useEffect ~ options:", options);
		if (options?.length) setData([...options]);
	}, [refetch, categories]);
	// useEffect(() => {
	//     if(defaultValueId && data?.length) {

	//     }
	// },[defaultValueId])
	return (
		<Space direction="vertical">
			{hasLabel && <LabelCustom label="Loại trang sức" required />}
			<Select
				status={props.status ? "error" : undefined}
				size="large"
				style={{ width: "100%" }}
				placeholder="Chọn loại trang sức"
				disabled={isLoadingCategories}
				options={data}
				loading={isLoadingCategories}
				defaultValue={defaultValueId}
				{...props}
			/>
		</Space>
	);
};

export default SelectCategoryForm;
