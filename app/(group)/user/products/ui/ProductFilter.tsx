"use client";
import { Select, Slider } from "antd";
import { SliderSingleProps } from "antd/lib";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { useRouterCustom } from "@/hooks";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { formatUtil } from "@/utils";

import { projectStore } from "../store/ProdcutStore";
import ImageSearchFilter from "./ImageSerachFilter";

type Props = {};
const { formatCurrency } = formatUtil;

// Function to scale a value to the slider range (0 - 100)
const minPrice = 1;
const maxPrice = 120;
const marks: SliderSingleProps["marks"] = {
	1: "100 Nghìn",
	10: "1 Triệu",
	50: "5 Triệu",
	100: "10 Triệu",
	120: "> 10 Triệu",
};
const optionsSort = [
	{ label: "Mới nhất", value: "createdDate,desc" },
	{ label: "Giá thấp đến cao", value: "price,asc" },
	{ label: "Giá cao đến thấp", value: "price,desc" },
];

const Filter: React.FC<Props> = ({}) => {
	const setQuery = projectStore((state) => state.setQuery);
	const reset = projectStore((state) => state.reset);
	const [priceRange, setPriceRange] = useState<number[]>([
		minPrice,
		maxPrice,
	]);
	const [priceRangeDebounced] = useDebounce(priceRange, 700);
	const { searchParams } = useRouterCustom();

	useEffect(() => {
		const textSearch = searchParams?.get("textSearch");
		console.log("🚀 ~ useEffect ~ textSearch:", textSearch);
		if (textSearch) setQuery({ name: { contains: textSearch } });
		return () => {
			reset();
		};
	}, [searchParams]);

	const handleSearch = (value: string) => {
		setQuery({
			page: 0,
			name: { contains: value },
		});
	};
	useEffect(() => {
		if (priceRangeDebounced) {
			const price =
				priceRangeDebounced[1] === maxPrice
					? { greaterThanOrEqual: priceRangeDebounced[0] * 100000 }
					: {
							greaterThanOrEqual: priceRangeDebounced[0] * 100000,
							lessThanOrEqual: priceRangeDebounced[1] * 100000,
						};
			setQuery({
				price,
			});
		}
	}, [priceRangeDebounced]);

	const priceRangeValue = useCallback(() => {
		const startPrice = formatCurrency(priceRangeDebounced[0] * 100000);
		const endPrice = formatCurrency(priceRangeDebounced[1] * 100000);
		if (
			priceRangeDebounced[1] === priceRangeDebounced[0] &&
			priceRangeDebounced[1] === maxPrice
		)
			return "Lớn hơn 10 Triệu";
		if (
			priceRangeDebounced[1] !== priceRangeDebounced[0] &&
			priceRangeDebounced[1] === maxPrice
		)
			return `${startPrice} - Lớn hơn 10 Triệu`;

		return `${startPrice} - ${endPrice}`;
	}, [priceRangeDebounced]);
	return (
		<div className="flex flex-col justify-center  gap-4 bg-white rounded-lg p-4">
			<ImageSearchFilter />
			<LabelCustom label="Bộ lọc" />
			<div className="flex  gap-3">
				<div className="flex justify-start gap-3">
					<SelectCategoryForm
						hasLabel={false}
						size="large"
						allowClear
						onChange={(value) => {
							console.log("🚀 ~ onChange ~ SelectCategoryForm");

							setQuery({
								page: 0,
								categoryId: { equals: value },
							});
						}}
					/>
				</div>
				<div>
					<Select
						options={optionsSort}
						size="large"
						className="min-w-40"
						onChange={(value) => {
							console.log("🚀 ~ onChange ~ optionsSort");
							setQuery({
								page: 0,
								sort: value,
							});
						}}
						placeholder="Sắp xếp"
						allowClear
					/>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center">
				<Slider
					range
					min={minPrice}
					max={maxPrice}
					marks={marks}
					defaultValue={[minPrice, maxPrice]}
					className="w-[90%] mx-5"
					tooltip={{ open: false }}
					onChange={(value) => {
						console.log("🚀 ~ onChange ~ setPriceRange");
						setPriceRange(value);
					}}
				/>
				<p>Giá: {priceRangeValue()}</p>
			</div>
		</div>
	);
};

export default memo(Filter);
