import templateService from "@/services/templateService";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DrawerForm, TemplateList } from "./ui";
import ButtonDrawer from "./ui/ButtonDrawer";
import DeleteTemplateFrom from "./ui/DeleteTemplateFrom";

type Props = {};

const hydrate = async () => {
	const queryClient = queryClientUtil.getQueryClient();
	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["templates"],
			queryFn: () => templateService.get({}),
		}),
		await queryClient.prefetchQuery({
			queryKey: ["templates-count"],
			queryFn: () => templateService.getCount({}),
		}),
	]);

	return dehydrate(queryClient);
};
const TemplatePage: React.FC<Props> = () => {
	return (
		<Frame
			title="Bản thảo mẫu"
			discription={
				<div className="flex flex-col text-sm text-gray-500 font-medium italic">
					<span>
						Việc tạo bản mẫu trước giúp bạn dễ dàng chọn công viêc
						khi tạo dự án
					</span>
				</div>
			}
			buttons={<ButtonDrawer />}
		>
			<div>
				<DrawerForm />
				<DeleteTemplateFrom />
				<HydrationBoundary state={hydrate()}>
					<TemplateList />
				</HydrationBoundary>
			</div>
		</Frame>
	);
};

export default TemplatePage;
