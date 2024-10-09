"use client";
import { Button, Space } from "antd";
import { Plus, RotateCw } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useQueries } from "react-query";

import categoryService from "@/services/categoryService";
import { Frame } from "@/shared/Frame";

import categoryStore from "./store";
import CategoryDelete from "./ui/CategoryDelete";
import CategoryList from "./ui/CategoryList";
import DrawerForm from "./ui/DrawerForm";

const CategoriesPage: React.FC<{}> = () => {
	const {
		toggleRefresh,
		setQuery,
		setOpenDrawer,
		query,
		setPagination,
		pagination,
		reset,
	} = categoryStore();

	const [
		{
			data: categories,
			refetch: refreshCategories,
			isLoading: isLoadingCategories,
		},
		{
			data: categoriesCount,
			refetch: refreshCategoriesCount,
			isLoading: isLoadingCategoriesCount,
		},
	] = useQueries([
		{
			queryKey: ["categories", { ...query }],
			queryFn: () => categoryService.get(query),
		},
		{
			queryKey: ["categories-count", { ...query }],
			queryFn: () => categoryService.getCount(query),
			onSuccess(data: number) {
				setPagination({ ...pagination, total: data });
			},
		},
	]);

	const refresh = useCallback(() => {
		refreshCategories();
		refreshCategoriesCount();

		setPagination({ ...pagination, current: 1 });
		setQuery({ ...query, page: 0 });
	}, []);

	useEffect(() => {
		refresh();
	}, [toggleRefresh]);

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	return (
		<Frame
			title="Loại trang sức"
			discription={
				<div className="flex flex-col text-sm text-gray-500 font-medium italic">
					<span>Tạo và quản lí các loại trang sức</span>
				</div>
			}
			buttons={
				<Button
					type="primary"
					icon={<Plus size={18} />}
					onClick={() => setOpenDrawer(true)}
				>
					Tạo phân loại
				</Button>
			}
		>
			<Space direction="vertical" className="flex">
				<DrawerForm />
				<CategoryDelete />

				<Button onClick={refresh} icon={<RotateCw size={18} />}>
					Làm mới
				</Button>
				<CategoryList
					data={categories}
					loading={isLoadingCategories || isLoadingCategoriesCount}
				/>
			</Space>
		</Frame>
	);
};

export default CategoriesPage;
