import React from "react";

import { userService } from "@/services";
import { Frame } from "@/shared/Frame";
import queryClientUtil from "@/utils/queryClientUtil";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { EmployeeList } from "./ui";

const { getQueryClient } = queryClientUtil;
type Props = {};
const hydrate = async () => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["employees"],
		queryFn: () => userService.getUsersByRole(),
	});
	return dehydrate(queryClient);
};
const EmployeePage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Nhân viên">
			<HydrationBoundary state={hydrate()}>
				<EmployeeList />
			</HydrationBoundary>
		</Frame>
	);
};

export default EmployeePage;
