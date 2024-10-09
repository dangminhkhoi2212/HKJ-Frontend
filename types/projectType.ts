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
	status: TStatus; // Assuming these are possible statuses
	priority: TPriority; // Assuming these are possible priorities
	budget: number;
	actualCost: number;
	qualityCheck: boolean;
	notes: string;
	jewelry: Omit<TJewelry, "project">;
};
