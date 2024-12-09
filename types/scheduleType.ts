import { TPriority } from "./priorityType";
import { TStatus } from "./statusType";

export type TSchedule = {
	id: number;
	name: string;
	description: string;
	assigned_date: string;
	expect_date: string;
	completed_date: string;
	status: TStatus;
	priority: TPriority;
	fist_name: string;
	last_name: string;
	email: string;
	phone: string;
	address: string;
};
