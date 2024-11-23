import { Task } from "gantt-task-react";

import { TStatus } from "./statusType";

export type TGanttTaskCustom = Task & {
	more?: {
		status: TStatus;
	};
};
