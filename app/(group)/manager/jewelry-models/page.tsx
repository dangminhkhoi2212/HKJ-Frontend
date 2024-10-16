import { Button } from "antd";
import { Plus } from "lucide-react";
import Link from "next/link";

import { routesManager } from "@/routes";
import { jewelryService } from "@/services";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import {
	dehydrate,
	DehydratedState,
	HydrationBoundary,
} from "@tanstack/react-query";

import JewelryList from "./ui/JewelryList";

type Props = {};
const { getQueryClient } = queryClientUtil;

const getHydrateState = async (): Promise<DehydratedState> => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["jewelry-model"],
		queryFn: () => jewelryService.get({}),
	});

	return dehydrate(queryClient);
};
const JewelryModelPage: React.FC<Props> = async () => {
	const hydrateState = await getHydrateState();
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
			<HydrationBoundary state={hydrateState}>
				<JewelryList />
			</HydrationBoundary>
		</Frame>
	);
};

export default JewelryModelPage;
