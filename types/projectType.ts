import { TCategory } from "./categoryType";
import { TJewelry } from "./jewelryType";
import { TPriority } from "./priorityType";
import { TStatus } from "./statusType";

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
	budget: number;
	actualCost: number;
	qualityCheck: boolean;
	notes: string;
	jewelry: Omit<TJewelry, "project">;
	category: TCategory;
};

export type TProjectCreate = {
	name: string;
	coverImage?: string;
	description?: string;
	startDate: string;
	expectDate: string;
	endDate: string;
	status: string;
	priority: string;
	budget: number;
	actualCost?: number;
	qualityCheck: boolean;
	notes?: string;
	category: { id: number };
	jewelry?: { id?: number | null } | null;
};

export type TProjectUpdate = TProjectCreate & { id: number };
export type TProjectQuery = { id: number };
