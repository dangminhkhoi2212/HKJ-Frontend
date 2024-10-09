import { Button, Divider, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueries } from "react-query";

import positionService from "@/services/positionService";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TQuery } from "@/types";
import { TPosition, TPositionQuery } from "@/types/postionType";
import { queryUtil } from "@/utils";

type TPros = {
	onChange: (selectedPosition: TPosition) => void;
};
const initPositionQuery: TQuery<TPositionQuery> = {
	sort: queryUtil.createSortOption("lastModifiedDate")!.desc,
	size: 8,
	page: 0,
};
const SelectPositionForm: React.FC<TPros> = ({ onChange }) => {
	const [data, setData] = useState<TPosition[]>([]);
	const [pageCount, setPageCount] = useState<number>(99999);
	const [query, setQuery] =
		useState<TQuery<TPositionQuery>>(initPositionQuery);

	const [getPositionsQuery, getPositionsCountQuery] = useQueries([
		{
			queryKey: ["positions", { ...query }],
			queryFn: () => positionService.get(query),
			onSuccess: (dataRepsonse: TPosition[]) => {
				setData([...data, ...dataRepsonse]);
			},
			onError: (error: any) => {
				console.log("🚀 ~ useAdminPositionsAction ~ error:", error);
			},
		},
		{
			queryKey: ["positions-count", { ...query }],
			queryFn: () => positionService.getCount(query),
			onSuccess: (data: number) => {
				// setPagination((pre) => ({ ...pre, total: data }));
				setPageCount(data);
			},
		},
	]);

	const loadMoreData = () => {
		setQuery((pre) => ({ ...pre, page: pre.page! + 1 }));
	};

	const refreshPositionsData = async () => {
		getPositionsQuery.refetch();
		getPositionsCountQuery.refetch();
	};

	useEffect(() => {
		refreshPositionsData();
	}, []);
	const handleSearch = (value: string) => {
		setQuery((pre) => ({ ...pre, name: { contains: value }, page: 0 }));
		setData([]);
	};
	const handleOnchange = (data: TPosition) => {
		if (onChange) {
			onChange(data);
		}
	};
	return (
		<div>
			<InputSearchCustom handleSearch={handleSearch} />
			<p className="font-medium text-xs mt-2">
				Tổng số vị trí: {getPositionsCountQuery.data}
			</p>
			<div id="scrollableDiv" className=" overflow-auto p-5 h-[350px] ">
				<InfiniteScroll
					dataLength={data.length}
					next={loadMoreData}
					hasMore={data.length < pageCount}
					loader={<Skeleton paragraph={{ rows: 1 }} active />}
					endMessage={<Divider plain>Không còn dữ liệu 🤐</Divider>}
					scrollableTarget="scrollableDiv"
				>
					<List
						dataSource={data}
						renderItem={(item, index) => (
							<List.Item
								key={item.id}
								actions={[
									<Button
										key={item.id}
										onClick={(data) => handleOnchange(item)}
									>
										Chọn
									</Button>,
								]}
							>
								<List.Item.Meta
									title={
										<p>
											{index + 1}. {item.name}
										</p>
									}
								/>
							</List.Item>
						)}
					/>
				</InfiniteScroll>
			</div>
		</div>
	);
};

export default SelectPositionForm;
