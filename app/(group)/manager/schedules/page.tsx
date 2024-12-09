import React from "react";

import { Frame } from "@/shared/Frame";

import { ScheduleList } from "./ui";

type Props = {};

const SchedulePage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Công việc dành cho nhân viên">
			<ScheduleList />
		</Frame>
	);
};

export default SchedulePage;
