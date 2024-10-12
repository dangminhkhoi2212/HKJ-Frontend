import { TAudit } from "./auditType";
import { TFilter } from "./filterType";
import { TPriority } from "./priorityType";
import { TProject } from "./projectType";
import { TStatus } from "./statusType";

export type TTask = {
	id: number;
	name: string;
	coverImage: string;
	description?: string;
	assignedDate: string;
	expectDate: string;
	completedDate: string;
	status: TStatus;
	priority: TPriority;
	point: number;
	project: TProject;
} & TAudit;
export type TTaskCreate = Omit<
	TTask,
	"id" | "project" | "materials" | "point" | "completedDate" | "coverImage"
> & { project: { id: number } };
export type TTaskQuery = {
	projectId: TFilter;
};
