"use client";
import { Select, Space } from 'antd';
import { SelectProps } from 'antd/lib';
import React, { useEffect, useState } from 'react';

import { materialService } from '@/services';
import { LabelCustom } from '@/shared/FormCustom/InputCustom';
import { TCategory } from '@/types';
import { useQuery } from '@tanstack/react-query';

type TProps = SelectProps & {
	hasLabel?: boolean;
	defaultValueId?: number;
};
const SelectMaterialForm: React.FC<TProps> = ({
	hasLabel = true,
	// defaultValueId,
	...props
}) => {
	const [data, setData] = useState<SelectProps["options"]>([]);
	const [query] = useState({ page: 0, size: 100 });
	// const [defaultValue, setDefaultValue] = useState<number | null>(
	// 	defaultValueId || null
	// );
	// Using useQuery to fetch materials once
	console.log("🚀 ~ SelectMaterialForm ~ data:", props.defaultValue);

	const {
		data: materials,
		refetch,
		isLoading: isLoadingCategories,
	} = useQuery({
		queryKey: ["materials", query],
		queryFn: () => materialService.get(query),

		enabled: !data?.length,
	});
	useEffect(() => {
		const options: { value: number; label: string; key: number }[] =
			materials?.map((item: TCategory) => ({
				value: item.id,
				key: item.id,
				label: item.name,
			}));
		if (options?.length) setData([...options]);
	}, [refetch, materials]);
	// useEffect(() => {
	// 	setDefaultValue(defaultValue);
	// }, [defaultValueId]);
	return (
		<Space direction="vertical">
			{hasLabel && <LabelCustom label="Chất liệu" required />}
			<Select
				status={props.status ? "error" : undefined}
				size="large"
				style={{ width: "100%" }}
				placeholder="Chọn chất liệu"
				disabled={isLoadingCategories}
				options={data}
				loading={isLoadingCategories}
				// defaultValue={defaultValue}
				{...props}
			/>
		</Space>
	);
};

export default SelectMaterialForm;
