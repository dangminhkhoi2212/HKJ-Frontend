import { Button, List, Spin } from 'antd';
import { ArrowBigRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { QUERY_CONST } from '@/const';
import { routesUser } from '@/routes';
import { jewelryService } from '@/services';
import { ProductCard } from '@/shared/CardCustom';
import { EmptyCustom } from '@/shared/EmptyCustom';
import { Frame } from '@/shared/Frame';
import { TJewelryQuery, TQuery } from '@/types';
import { useQuery } from '@tanstack/react-query';

type Props = { categoryId: string | number | null, jewelryId:string|number|null };

const ProductRelative: React.FC<Props> = ({ categoryId ,jewelryId}) => {
	const [query, setQuery] = useState<TQuery<TJewelryQuery>>({
		...QUERY_CONST.defaultQuery,
		size: 4,
		categoryId: { equals: categoryId },
		id: { notEquals: jewelryId },
	});
	const { data, isFetching } = useQuery({
		queryKey: ["product-relative", query],
		queryFn: () => {
			return jewelryService.get(query);
		},
		enabled: !!jewelryId && !! categoryId,
	});
	return (
		<Spin spinning={isFetching}>
			<Frame title="Sản phẩm liên quan">
				{!categoryId ? (
					<EmptyCustom></EmptyCustom>
				) : (
					<div className="flex flex-col gap-4 justify-stretch items-center">
						{data?.length !== 0 ? (
							<List
								grid={{
									gutter: 16,
									xs: 2,
									sm: 2,
									md: 2,
									lg: 4,
									xl: 4,
								}}
								dataSource={data}
								renderItem={(item) => (
									<List.Item className="h-full" key={item.id}>
										<ProductCard jewelry={item} />
									</List.Item>
								)}
							/>
						) : (
							<EmptyCustom />
						)}

						<Link
							href={
								routesUser.product + "?categoryId=" + categoryId
							}
						>
							<Button
								className="w-full"
								icon={<ArrowBigRight size={16} />}
								iconPosition="end"
							>
								Xem thêm
							</Button>
						</Link>
					</div>
				)}
			</Frame>
		</Spin>
	);
};

export default ProductRelative;
