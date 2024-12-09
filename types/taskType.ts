import { TAudit } from "./auditType";
import { TEmployee } from "./employeeType";
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
	employee: TEmployee;
} & TAudit;
export type TTaskCreate = Omit<
	TTask,
	"id" | "project" | "materials" | "point" | "completedDate" | "coverImage"
> & { project: { id: number } };

export type TTaskUpdate = Omit<
	TTask,
	"project" | "materials" | "point" | "coverImage"
> & { project: { id: number } };
export type TTaskQuery = {
	projectId?: TFilter;
	employee?: {
		id?: number;
	};
	name?: TFilter;
	priority?: TFilter;
	status?: TFilter;
};
