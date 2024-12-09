"use client";
import { Button, InputNumber, Select, Space } from "antd";
import { SliderSingleProps } from "antd/lib";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { SelectMaterialForm } from "@/shared/FormSelect";
import { SelectCategoryForm } from "@/shared/FormSelect/SelectCategoryForm";
import { imageSearchAIStore } from "@/stores";
import { formatUtil } from "@/utils";

import { projectStore } from "../store/productStore";
import { ImageSearchFilter } from "./index";

type Props = {};
const { formatCurrency } = formatUtil;

// Function to scale a value to the slider range (0 - 100)
const minPrice = 100000;
const maxPrice = 1000000000;
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
	const image = imageSearchAIStore((state) => state.file);
	const setQuery = projectStore((state) => state.setQuery);
	const query = projectStore((state) => state.query);
	const setPagination = projectStore((state) => state.setPagination);
	const router = useRouterCustom().router;
	const reset = projectStore((state) => state.reset);

	const [startPrice, setStartPrice] = useState<number>(100000);
	const [endPrice, setEndPrice] = useState<number>(10000000);
	const startPriceDebounced = useDebounce(startPrice, 700);
	const endPriceDebounced = useDebounce(endPrice, 700);
	const { searchParams, updatePathname } = useRouterCustom();

	useEffect(() => {
		const textSearch = searchParams?.get("textSearch");
		const materialId = searchParams?.get("materialId");
		const categoryId = searchParams?.get("categoryId");
		const page = searchParams?.get("page");
		const size = searchParams?.get("size");
		const sort = searchParams?.get("sort");

		if (textSearch) setQuery({ name: { contains: textSearch } });
		if (materialId)
			setQuery({ materialId: { equals: Number(materialId) } });
		if (categoryId)
			setQuery({ categoryId: { equals: Number(categoryId) } });
		if (page) {
			const current = Number(page);
			setQuery({ page: current });
		}
		setQuery({ sort: sort || "createdDate,desc" });
		if (size) setQuery({ size: Number(size) });

		return () => {
			reset();
		};
	}, [searchParams, setQuery, reset]);

	const handleSearch = useCallback(
		(value: string) => {
			setQuery({
				page: 0,
				name: { contains: value },
			});
		},
		[setQuery]
	);

	useEffect(() => {
		let start = startPriceDebounced[0];
		let end = endPriceDebounced[0];

		if (start > end) {
			start = endPriceDebounced[0];
			end = startPriceDebounced[0];
		}
		const price = {
			greaterThanOrEqual: start,
			lessThanOrEqual: end,
		};

		setQuery({
			price,
		});
	}, [startPriceDebounced[0], endPriceDebounced[0], setQuery]);

	const handleCategoryChange = useCallback(
		(value: number) => {
			updatePathname({
				query: { categoryId: value, page: 0 },
				type: "replace",
			});
		},
		[updatePathname]
	);

	const handleMaterialChange = useCallback(
		(value: number) => {
			updatePathname({
				query: { materialId: value, page: 0 },
				type: "replace",
			});
		},
		[updatePathname]
	);

	const handleSortChange = useCallback(
		(value: string) => {
			updatePathname({
				query: { sort: value, page: 0 },
				type: "replace",
			});
		},
		[updatePathname]
	);

	const handleResetFilter = useCallback(() => {
		setStartPrice(100000);
		setEndPrice(10000000);
		router.replace(routesUser.product);
		reset();
	}, [router, reset]);

	const handleChangeStartPrice = useCallback(
		(value: number | null) => {
			if (value) {
				if (value > endPrice) {
					setStartPrice(endPrice);
					setEndPrice(value);
				} else setStartPrice(value);
			}
		},
		[endPrice]
	);

	const handleChangeEndPrice = useCallback(
		(value: number | null) => {
			if (value) {
				if (value < startPrice) {
					setEndPrice(startPrice);
					setStartPrice(value);
				} else setEndPrice(value);
			}
		},
		[startPrice]
	);

	if (image)
		return (
			<div className="flex flex-col justify-center  gap-4 bg-white rounded-lg p-4">
				<ImageSearchFilter />
			</div>
		);
	return (
		<div className="flex flex-col justify-center  gap-4 bg-white rounded-lg p-4">
			<LabelCustom label="Bộ lọc" />
			<div className="flex  gap-3">
				<div className="flex justify-start gap-3">
					<SelectCategoryForm
						hasLabel={false}
						size="large"
						allowClear
						value={query.categoryId?.equals}
						onChange={handleCategoryChange}
					/>
				</div>
				<Space>
					<SelectMaterialForm
						onChange={handleMaterialChange}
						hasLabel={false}
						value={query.materialId?.equals}
						allowClear
					/>
				</Space>
				<Space>
					Giá:{" "}
					<Space>
						<InputNumber
							min={minPrice}
							max={maxPrice}
							size="large"
							className="w-40 text-right"
							defaultValue={minPrice}
							value={startPrice}
							parser={(value) =>
								value?.replace(
									/\$\s?|(,*)/g,
									""
								) as unknown as number
							}
							formatter={(value) =>
								`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							}
							onChange={handleChangeStartPrice}
						/>{" "}
						-{" "}
						<InputNumber
							min={minPrice}
							max={maxPrice}
							parser={(value) =>
								value?.replace(
									/\$\s?|(,*)/g,
									""
								) as unknown as number
							}
							formatter={(value) =>
								`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							}
							size="large"
							className="w-40 text-right"
							defaultValue={maxPrice}
							value={endPrice}
							onChange={handleChangeEndPrice}
						/>
					</Space>
				</Space>
				<div>
					<Select
						options={optionsSort}
						size="large"
						className="min-w-40"
						defaultValue={optionsSort[0].value}
						value={query.sort}
						onChange={handleSortChange}
						placeholder="Sắp xếp"
						allowClear
					/>
				</div>
				<Button onClick={handleResetFilter} size="large">
					Đặt lại bộ lọc
				</Button>
			</div>
			<div className="flex flex-col justify-center items-center">
				{/* <Slider
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
				/> */}
			</div>
		</div>
	);
};

export default memo(Filter);
