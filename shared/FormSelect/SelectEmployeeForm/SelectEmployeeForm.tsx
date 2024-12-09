import { Button, Divider, List, Modal, Skeleton, Space } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { AUTHORIZATIONS_CONST } from "@/const";
import { userService } from "@/services";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { InputSearchCustom } from "@/shared/FormCustom/InputSearchCustom";
import { TAccontQuery, TAccountInfo, TQuery } from "@/types";
import { useQueries } from "@tanstack/react-query";

const { AUTHORIZATIONS } = AUTHORIZATIONS_CONST;
type TPros = {
	onChange: (selectedPosition: TAccountInfo) => void;
	defaultValueId?: number;
};

const SelectEmployeeForm: React.FC<TPros> = ({ onChange, defaultValueId }) => {
	const [data, setData] = useState<TAccountInfo[]>([]);
	const [pageCount, setPageCount] = useState<number>(99999);
	const [query, setQuery] = useState<TQuery<TAccontQuery>>({
		role: AUTHORIZATIONS.ROLE_EMPLOYEE,
		page: 0,
		size: 8,
		active: { equals: true },
	});
	const [employee, setEmployee] = useState<TAccountInfo | null>(null);
	const [showModel, setShowModel] = useState<boolean>(false);
	const [getQuery, getCountQuery] = useQueries({
		queries: [
			{
				queryKey: ["accounts", { ...query }],
				queryFn: () => userService.getUsersByRole(query),
			},
			{
				queryKey: ["accounts-count", { ...query }],
				queryFn: () => userService.getUsersByRoleCount(query),
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

	useEffect(() => {
		return () => {};
	}, []);

	const handleSearch = (value: string) => {
		setQuery((pre) => ({ ...pre, "name.contains": value, page: 0 }));
		setData([]);
	};
	const handleOnchange = (data: TAccountInfo) => {
		if (onChange) {
			onChange(data);
		}
		setEmployee(data);
		setShowModel(false);
	};
	useEffect(() => {
		if (data?.length && defaultValueId) {
			onChange(data?.find((item) => item.id === defaultValueId)!);
		}
	}, [defaultValueId, data]);
	return (
		<Space direction="vertical" className="flex">
			<LabelCustom label="Chọn tài khoản nhân viên" required />
			<Button
				onClick={() => setShowModel(true)}
				loading={getQuery.isLoading}
			>
				Chọn
			</Button>
			<Modal
				open={showModel}
				onCancel={() => setShowModel(false)}
				centered
				footer={null}
			>
				<div>
					<InputSearchCustom handleSearch={handleSearch} />
					<p className="font-medium text-xs mt-2">
						Tổng số nhân viên: {getCountQuery.data || 0}
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
														{item.firstName +
															" " +
															item.lastName}
													</p>
													<p className="text-xs text-gray-500 m-0">
														{item.email}
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
		</Space>
	);
};

export default SelectEmployeeForm;
