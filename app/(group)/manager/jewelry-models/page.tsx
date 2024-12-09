import { Button } from "antd";
import { Plus } from "lucide-react";
import Link from "next/link";

import { QUERY_CONST } from "@/const";
import { routesManager } from "@/routes";
import { jewelryService } from "@/services";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, DehydratedState } from "@tanstack/react-query";

import JewelryList from "./ui/JewelryList";

type Props = {};
const { getQueryClient } = queryClientUtil;
const { defaultQuery } = QUERY_CONST;
const getHydrateState = async (): Promise<DehydratedState> => {
	const queryClient = getQueryClient();

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["jewelry-model"],
			queryFn: () => jewelryService.get(defaultQuery),
		}),
		await queryClient.prefetchQuery({
			queryKey: ["jewelry-model-count"],
			queryFn: () => jewelryService.getCount(defaultQuery),
		}),
	]);

	return dehydrate(queryClient);
};
const JewelryModelPage: React.FC<Props> = async () => {
	return (
		<Frame
			title="Trang sức"
			buttons={
				<Link href={routesManager.createJewelry}>
					<Button type="primary" icon={<Plus />}>
						Tạo mẫu trang sức
					</Button>
				</Link>
			}
		>
			{/* <HydrationBoundary state={await getHydrateState()}> */}
			<JewelryList />
			{/* </HydrationBoundary> */}
		</Frame>
	);
};

export default JewelryModelPage;
