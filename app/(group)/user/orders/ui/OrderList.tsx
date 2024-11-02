"use client";
import { Button, Divider, List, Skeleton, Space, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { QUERY_CONST } from '@/const';
import { useRouterCustom } from '@/hooks';
import { useAccountStore } from '@/providers';
import { routesUser } from '@/routes';
import { orderService } from '@/services';
import { EmptyCustom } from '@/shared/EmptyCustom';
import { TOrder, TOrderQuery, TQuery, TStatus } from '@/types';
import { queryUtil } from '@/utils';
import { useQueries } from '@tanstack/react-query';

import OrderCard from './OrderCard';

type Props = {};

const defaultQuery = QUERY_CONST.defaultQuery;
const { createSortOption } = queryUtil;
const OrderList: React.FC<Props> = ({}) => {
	const account = useAccountStore((state) => state.account);
	console.log("🚀 ~ account:", account);
	const { searchParams } = useRouterCustom();
	const [pageSize, setPageSize] = useState<number>(Number.MAX_VALUE);
	const [query, setQuery] = useState<TQuery<TOrderQuery>>({
		...defaultQuery,
		size: 2,
		customerId: { equals: account?.id },
		status: { equals: TStatus.NEW },
		sort: createSortOption("createdDate")?.desc,
	});
	console.log("🚀 ~ query:", query);
	const [data, setData] = useState<TOrder[]>([]);
	const [getOrder, getOrderCount] = useQueries({
		queries: [
			{
				queryKey: ["orders", query],
				queryFn: () => orderService.get(query),
				enabled: !!account,
			},
			{
				queryKey: ["orders-count", query],
				queryFn: () => orderService.getCount(query),
				enabled: !!account,
			},
		],
	});
	const loadMoreData = () => {
		setQuery((pre) => ({ ...pre, page: pre.page! + 1 }));
	};
	useEffect(() => {
		if (getOrder?.data?.length) {
			setData((pre) => [...pre, ...getOrder.data]);
		}
	}, [getOrder.data]);
	useEffect(() => {
		if (getOrderCount?.data) {
			setPageSize(getOrderCount?.data!);
		}
	}, [getOrderCount.data]);

	useEffect(() => {
		const status = searchParams.get("status");
		if (status !== null && status in TStatus) {
			setData([]);
			setQuery((pre) => ({
				...pre,
				page: 0,
				status: { equals: status },
			}));
		}
	}, [searchParams]);

	if (!data?.length) {
		return (
			<EmptyCustom
				description={
					<Space direction="vertical">
						<p>Bạn chưa có đơn hàng nào</p>
						<Link href={routesUser.createOrder()}>
							<Button>Đặt hàng ngay</Button>
						</Link>
					</Space>
				}
			/>
		);
	}
	return (
		<div id="scrollableDiv" className="h-full overflow-auto no-scrollbar">
			<Spin
				spinning={getOrder.isLoading || getOrderCount.isLoading}
			></Spin>
			<InfiniteScroll
				dataLength={data.length}
				next={() => loadMoreData()}
				hasMore={data.length < pageSize}
				loader={<Skeleton paragraph={{ rows: 3 }} active />}
				endMessage={<Divider plain>Không còn dữ liệu 🤐</Divider>}
				scrollableTarget="scrollableDiv"
			>
				<List
					dataSource={data}
					renderItem={(item, index) => (
						<List.Item key={item.id}>
							<OrderCard order={item} key={item.id} />
						</List.Item>
					)}
				/>
			</InfiniteScroll>
		</div>
	);
};

export default OrderList;
