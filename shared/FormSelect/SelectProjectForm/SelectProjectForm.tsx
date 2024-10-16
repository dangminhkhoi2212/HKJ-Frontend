"use client";
import { Button, Divider, List, Modal, Skeleton, Space } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { AUTHORIZATIONS_CONST } from "@/const";
import projectService from "@/services/projectService";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TProject, TQuery } from "@/types";
import { useQueries } from "@tanstack/react-query";

const { AUTHORIZATIONS } = AUTHORIZATIONS_CONST;
type TPros = {
	onChange?: (selectedPosition: TProject) => void;
};

const SelectProjectForm: React.FC<TPros> = ({ onChange }) => {
	const [data, setData] = useState<TProject[]>([]);
	const [pageCount, setPageCount] = useState<number>(99999);
	const [query, setQuery] = useState<TQuery<{}>>({
		page: 0,
		size: 8,
	});
	const [showModel, setShowModel] = useState<boolean>(false);
	const [getQuery, getCountQuery] = useQueries({
		queries: [
			{
				queryKey: ["projects", { ...query }],
				queryFn: () => projectService.get(query),
				staleTime: 5 * 60 * 1000,
			},
			{
				queryKey: ["projects-count", { ...query }],
				queryFn: () => projectService.getCount(query),
				staleTime: 5 * 60 * 1000,
			},
		],
	});

	useEffect(() => {
		if (getQuery?.data?.length) setData([...data, ...getQuery?.data!]);
	}, [getQuery.data, getQuery.refetch]);

	useEffect(() => {
		setPageCount(getCountQuery.data as number);
	}, [getCountQuery.data, getCountQuery.refetch]);

	const loadMoreData = () => {
		setQuery((pre) => ({ ...pre, page: pre.page! + 1 }));
	};

	const refreshData = async () => {
		getQuery.refetch();
		getCountQuery.refetch();
	};

	const handleSearch = (value: string) => {
		setQuery((pre) => ({ ...pre, "name.contains": value, page: 0 }));
		setData([]);
	};
	const handleOnchange = (data: TProject) => {
		if (onChange) {
			onChange(data);
		}
		setShowModel(false);
	};
	return (
		<div className="flex flex-col">
			<Space direction="vertical">
				<LabelCustom label="Chọn dự án" required />
				<Button onClick={() => setShowModel(true)}>Chọn</Button>
			</Space>
			<Modal
				open={showModel}
				onCancel={() => setShowModel(false)}
				centered
				footer={null}
			>
				<div>
					<InputSearchCustom handleSearch={handleSearch} />
					<p className="font-medium text-xs mt-2">
						Tổng số vị trí: {getCountQuery.data || 0}
					</p>
					<div
						id="scrollableDiv"
						className=" overflow-auto p-5 h-[350px] "
					>
						<InfiniteScroll
							dataLength={data.length}
							next={loadMoreData}
							hasMore={data.length < pageCount}
							loader={<Skeleton paragraph={{ rows: 1 }} active />}
							endMessage={
								<Divider plain>Không còn dữ liệu 🤐</Divider>
							}
							scrollableTarget="scrollableDiv"
						>
							<List
								dataSource={data}
								renderItem={(item) => (
									<List.Item
										key={item.id}
										actions={[
											<Button
												key={item.id}
												onClick={() => {
													handleOnchange(item);
												}}
											>
												Chọn
											</Button>,
										]}
									>
										<List.Item.Meta
											title={
												<div className="flex flex-col">
													<p className="p-0 m-0">
														{item.name}
													</p>
													<p className="text-xs text-gray-500 m-0">
														Mã dự án {item.id}
													</p>
												</div>
											}
										/>
									</List.Item>
								)}
							/>
						</InfiniteScroll>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default SelectProjectForm;
