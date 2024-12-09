import React from "react";

import { Frame } from "@/shared/Frame";

import { StatisticDashBoard } from "../admin/ui";

type Props = {};

const AdminPage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Thống kê">
			<StatisticDashBoard />
		</Frame>
	);
};

export default AdminPage;
