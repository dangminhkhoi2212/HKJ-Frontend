import { TAudit } from "./auditType";
import { TCategory } from "./categoryType";
import { TFilter } from "./filterType";
import { TMaterial } from "./materialType";
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

	actualCost: number;
	qualityCheck: boolean;
	notes: string;
	category: TCategory;
	manager: TUserExtra;
	material: TMaterial;
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

	actualCost?: number;
	qualityCheck: boolean;
	notes?: string;
	category: { id: number };
	manager: { id: number };
};

export type TProjectUpdate = TProjectCreate & { id: number };
export type TProjectQuery = {
	id?: TFilter;
	name?: TFilter;
	status?: TFilter;
	priority?: TFilter;
};
