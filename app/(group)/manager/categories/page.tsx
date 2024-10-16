import { Space } from 'antd';

import categoryService from '@/services/categoryService';
import { Frame } from '@/shared/Frame';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { ButtonRedirect } from './ui';
import CategoryDelete from './ui/CategoryDelete';
import CategoryList from './ui/CategoryList';
import DrawerForm from './ui/DrawerForm';

const CategoriesPage: React.FC<{}> = async () => {
	

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["categories"],
		queryFn: () => categoryService.get({}),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Frame
				title="Loại trang sức"
				discription={
					<div className="flex flex-col text-sm text-gray-500 font-medium italic">
						<span>Tạo và quản lí các loại trang sức</span>
					</div>
				}
				buttons={
					<ButtonRedirect/>
				}
			>
				<Space direction="vertical" className="flex">
					<DrawerForm />
					<CategoryDelete />

					<CategoryList />
				</Space>
			</Frame>
		</HydrationBoundary>
	);
};

export default CategoriesPage;
