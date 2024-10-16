"use client";

import {
	Avatar,
	Button,
	Divider,
	Image,
	List,
	Modal,
	Skeleton,
	Space,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Control, Controller, useWatch } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";

import { jewelryService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TJewelry, TJewelryQuery, TQuery } from "@/types";
import { queryUtil } from "@/utils";
import { useQueries } from "@tanstack/react-query";

interface SelectJewelryFormProps {
	onChange?: (selectedJewelry: TJewelry) => void;
	control: Control<any>;
	errorMessage?: string;
}

const INITIAL_QUERY: TQuery<TJewelryQuery> = {
	sort: queryUtil.createSortOption("lastModifiedDate")?.desc,
	size: 8,
	page: 0,
};

const SelectJewelryForm: React.FC<SelectJewelryFormProps> = ({
	onChange,
	control,
	errorMessage,
}) => {
	const [jewelryItems, setJewelryItems] = useState<TJewelry[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [query, setQuery] = useState<TQuery<TJewelryQuery>>(INITIAL_QUERY);
	const jewelryName = useWatch({
		control,
		name: "jewelry.name", // Specify the field you want to watch
	});
	const coverImage = useWatch({
		control,
		name: "jewelry.coverImage", // Specify the field you want to watch
	});
	// Queries for fetching jewelry items and count
	const [getJewelryQuery, getCountQuery] = useQueries({
		queries: [
			{
				queryKey: ["jewelry", query],
				queryFn: () => jewelryService.get(query),

				staleTime: 5000, // Cache stale time for query
			},
			{
				queryKey: ["jewelry-count", query],
				queryFn: () => jewelryService.getCount(query),
			},
		],
	});
	useEffect(() => {
		const newItems = getJewelryQuery.data || [];
		setJewelryItems((prevItems) =>
			query.page === 0 ? newItems : [...prevItems, ...newItems]
		);
	}, [getJewelryQuery]);

	useEffect(() => {
		setTotalCount(getCountQuery.data!);
	}, [getCountQuery]);

	// Memoized functions to avoid re-creation
	const loadMoreData = useCallback(() => {
		if (!getJewelryQuery.isLoading) {
			setQuery((prev) => ({ ...prev, page: (prev.page || 0) + 1 }));
		}
	}, [getJewelryQuery.isLoading]);

	const refreshData = useCallback(() => {
		getJewelryQuery.refetch();
		getCountQuery.refetch();
	}, [getJewelryQuery, getCountQuery]);

	const handleSearch = useCallback((searchValue: string) => {
		setQuery((prev) => ({
			...prev,
			name: { contains: searchValue },
			page: 0,
		}));
		setJewelryItems([]); // Reset items when search is performed
	}, []);

	const handleSelect = useCallback(
		(jewelry: TJewelry) => {
			if (onChange) {
				onChange(jewelry);
			}
			setIsModalVisible(false);
		},
		[onChange]
	);

	useEffect(() => {
		refreshData(); // Fetch data on mount and query changes
	}, []);

	const renderModalContent = useCallback(
		() => (
			<Controller
				name={"jewelry"}
				control={control}
				render={({ field, fieldState }) => (
					<div>
						<InputSearchCustom handleSearch={handleSearch} />
						<p className="font-medium text-xs mt-2">
							Tổng số trang sức: {getCountQuery.data}
						</p>
						<div
							id="scrollableDiv"
							className="overflow-auto p-5 h-[350px]"
						>
							<InfiniteScroll
								dataLength={jewelryItems.length}
								next={loadMoreData}
								hasMore={jewelryItems.length < totalCount}
								loader={
									<Skeleton paragraph={{ rows: 1 }} active />
								}
								endMessage={
									<Divider plain>
										Không còn dữ liệu 🤐
									</Divider>
								}
								scrollableTarget="scrollableDiv"
							>
								<List
									dataSource={jewelryItems}
									renderItem={(item, index) => (
										<List.Item
											key={item.id}
											actions={[
												<Button
													key={`select-${item.id}`}
													onClick={() => {
														field.onChange({
															id: item.id,
															name: item.name,
															coverImage:
																item.coverImage,
														});
														setIsModalVisible(
															false
														);
													}}
												>
													Chọn
												</Button>,
											]}
										>
											<List.Item.Meta
												avatar={
													<Avatar
														shape="square"
														className="size-10"
														src={item.coverImage}
													/>
												}
												title={<p>{item.name}</p>}
											/>
										</List.Item>
									)}
								/>
							</InfiniteScroll>
						</div>
					</div>
				)}
			/>
		),
		[
			getCountQuery.data,
			handleSearch,
			loadMoreData,
			jewelryItems.length,
			totalCount,
			handleSelect,
		]
	);

	return (
		<div>
			<Modal
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				title="Chọn trang sức"
				footer={null}
			>
				{renderModalContent()}
			</Modal>

			<Space direction="vertical">
				<LabelCustom label="Trang sức" />
				<Space
					direction="horizontal"
					className="ring-1 ring-gray-200 rounded-xl p-2"
				>
					<Image className="size-16 rounded-md" src={coverImage} />
					<span>{jewelryName}</span>
					<Button
						size="small"
						onClick={() => setIsModalVisible(true)}
					>
						Chọn
					</Button>
				</Space>
			</Space>
		</div>
	);
};

export default React.memo(SelectJewelryForm);
