"use client";
import { Select, Space } from "antd";
import { SelectProps } from "antd/lib";
import React, { memo, useEffect, useState } from "react";

import { materialService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { TCategory, TMaterialQuery, TQuery } from "@/types";
import { useQuery } from "@tanstack/react-query";

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
	const [query, setQuery] = useState<TQuery<TMaterialQuery>>({
		page: 0,
		size: 100,
		isDeleted: { equals: false },
	});

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
				...item,
				value: item.id,
				key: item.id,
				label: item.name,
			}));
		if (options?.length) setData([...options]);
	}, [refetch, materials]);

	return (
		<Space direction="vertical" className="w-full">
			{hasLabel && <LabelCustom label="Chất liệu" required />}
			<Select
				status={props.status ? "error" : undefined}
				size="large"
				className="min-w-28 "
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

export default memo(SelectMaterialForm);
