import { Button, Space } from 'antd';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { routesManager } from '@/routes';
import { materialService } from '@/services';
import { Frame } from '@/shared/Frame';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import MaterialList from './ui/MaterialList';

type TSelectMaterial = {
	show: boolean;
	record?: any;
};
const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["material"],
		queryFn: () => materialService.get({}),
	});
	return dehydrate(queryClient);
};
const MaterialPage: React.FC<{}> = () => {
	return (
		<Frame
			title="Chất liệu làm trang sức"
			buttons={
				<Link href={routesManager.addMaterial}>
					<Button type="primary" icon={<Plus size={18} />}>
						Thêm chất liệu
					</Button>
				</Link>
			}
		>
			<Space direction="vertical" className="flex">
				<HydrationBoundary state={hydrate()}>
					<MaterialList />
				</HydrationBoundary>
			</Space>
		</Frame>
	);
};

export default MaterialPage;
