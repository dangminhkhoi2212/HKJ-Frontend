import { Button, Divider, List, Modal, Skeleton, Space } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import positionService from '@/services/positionService';
import { LabelCustom } from '@/shared/FormCustom/InputCustom';
import { InputSearchCustom } from '@/shared/FormCustom/InputSearchCustom';
import { TQuery } from '@/types';
import { TPosition, TPositionQuery } from '@/types/postionType';
import { queryUtil } from '@/utils';
import { useQueries } from '@tanstack/react-query';

type TPros = {
	defaultValuedId?: number;
	onChange: (selectedPosition: TPosition) => void;
};
const initPositionQuery: TQuery<TPositionQuery> = {
	sort: queryUtil.createSortOption("lastModifiedDate")!.desc,
	size: 8,
	page: 0,
};
const SelectPositionForm: React.FC<TPros> = ({ onChange, defaultValuedId }) => {
	const [data, setData] = useState<TPosition[]>([]);
	const [pageCount, setPageCount] = useState<number>(99999);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [query, setQuery] =
		useState<TQuery<TPositionQuery>>(initPositionQuery);

	const [getPositionsQuery, getPositionsCountQuery] = useQueries({
		queries: [
			{
				queryKey: ["positions", { ...query }],
				queryFn: () => positionService.get(query),
			},
			{
				queryKey: ["positions-count", { ...query }],
				queryFn: () => positionService.getCount(query),
			},
		],
	});

	useEffect(() => {
		if (getPositionsQuery.isSuccess) {
			setData((pre) => [...pre, ...getPositionsQuery.data]);
		}
	}, [getPositionsQuery.data]);

	useEffect(() => {
		if (getPositionsCountQuery.isSuccess) {
			setPageCount(getPositionsCountQuery.data);
		}
	}, [getPositionsCountQuery.data]);
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
		setShowModal(false);
	};
	return (
		<Space direction="vertical">
			<LabelCustom label="Vị trí làm việc" required />
			<Button onClick={() => setShowModal(true)}>Chọn</Button>
			<Modal
				open={showModal}
				onCancel={() => setShowModal(false)}
				footer={null}
			>
				<InputSearchCustom handleSearch={handleSearch} />
				<p className="font-medium text-xs mt-2">
					Tổng số vị trí: {getPositionsCountQuery.data}
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
							renderItem={(item, index) => (
								<List.Item
									key={item.id}
									actions={[
										<Button
											key={item.id}
											onClick={(data) =>
												handleOnchange(item)
											}
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
			</Modal>
		</Space>
	);
};

export default memo(SelectPositionForm);
