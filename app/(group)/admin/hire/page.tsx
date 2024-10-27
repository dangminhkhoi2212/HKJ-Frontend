import React from 'react';

import { QUERY_CONST } from '@/const';
import { hireService } from '@/services';
import { Frame } from '@/shared/Frame';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { TabHire } from './ui';

const hydrate = async () => {
	const { defaultQuery } = QUERY_CONST;
	const queryClient = queryClientUtil.getQueryClient();

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["hires", defaultQuery], // Pass the query state as part of the key
			queryFn: () => hireService.get(defaultQuery),
		}),
		await queryClient.prefetchQuery({
			queryKey: ["hires-count", defaultQuery], // Use the same query object for count
			queryFn: () => hireService.getCount(defaultQuery),
		}),
	]);

	return dehydrate(queryClient);
};
const HirePage: React.FC<{}> = () => {
	return (
		<div className="grid grid-cols-1 gap-4">
			<Frame title="Cập nhật thông tin thuê nhân viên">
				<HydrationBoundary state={hydrate()}>
					<TabHire />
				</HydrationBoundary>
			</Frame>
		</div>
	);
};

export default HirePage;
