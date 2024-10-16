import React from "react";

import { jewelryService } from "@/services";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Tabs } from "./ui";

type Props = {
	params: {
		id: string;
	};
};

const hydrate = async (id: string) => {
	const queryClient = queryClientUtil.getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["jewelry", id],
		queryFn: () => jewelryService.getOne(Number.parseInt(id)),
	});
	return dehydrate(queryClient);
};
const updateMaterial: React.FC<Props> = ({ params: { id } }) => {
	return (
		<Frame title="Cập nhật trang sức">
			<HydrationBoundary state={hydrate(id)}>
				<Tabs />
			</HydrationBoundary>
		</Frame>
	);
};

export default updateMaterial;
