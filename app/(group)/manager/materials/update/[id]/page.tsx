import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import React from 'react';

import { materialService } from '@/services';
import { Frame } from '@/shared/Frame';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import UpdateMaterialForm from './ui/UpdateMaterialForm';

type Props = {
	params: Params;
};
const hydrate = async (id: string) => {
	const queryClient = queryClientUtil.getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["material", id],
		queryFn: () => materialService.getOne(id),
	});
	return dehydrate(queryClient);
};
const MaterialUpdatePage: React.FC<Props> = ({ params: { id } }) => {
	return (
		<Frame title="Cập nhật chất liệu">
			<HydrationBoundary state={hydrate(id)}>
				<UpdateMaterialForm id={id} />
			</HydrationBoundary>
		</Frame>
	);
};

export default MaterialUpdatePage;
