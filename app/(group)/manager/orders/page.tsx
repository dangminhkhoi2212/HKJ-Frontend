import React from 'react';

import { QUERY_CONST } from '@/const';
import { orderService } from '@/services';
import { Frame } from '@/shared/Frame';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, DehydratedState, HydrationBoundary } from '@tanstack/react-query';

import { OrderList } from './ui';

const { getQueryClient } = queryClientUtil;
const { defaultQuery } = QUERY_CONST;
const hydrate = async (): Promise<DehydratedState> => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["order"],
		queryFn: () => orderService.get({ ...defaultQuery }),
	});

	return dehydrate(queryClient);
};
const ManagerOrderPage: React.FC<{}> = () => {
    return <Frame title="Đơn hàng">
        <HydrationBoundary state={hydrate()}>

            <OrderList/>
        </HydrationBoundary>
    </Frame>;
};

export default ManagerOrderPage;
