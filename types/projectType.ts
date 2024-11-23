import { TAudit } from "./auditType";
import { TFilter } from "./filterType";
import { TPriority } from "./priorityType";
import { TStatus } from "./statusType";
import { TUserExtra } from "./userExtraType";

export type TProject = {
	id: number;
	name: string;
	coverImage: string;
	description: string;
	startDate: string;
	expectDate: string;
	endDate: string;
	status: TStatus;
	priority: TPriority;

	notes: string;
	manager: TUserExtra;
} & TAudit;

export type TProjectCreate = {
	name: string;
	coverImage?: string;
	description?: string;
	startDate: string;
	expectDate: string;
	endDate: string;
	status: string;
	priority: string;

	notes?: string;
	manager: { id: number };
};

export type TProjectUpdate = TProjectCreate & { id: number };
export type TProjectQuery = {
	id?: TFilter;
	name?: TFilter;
	status?: TFilter;
	priority?: TFilter;
};
