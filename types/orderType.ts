import { TCategory } from "./categoryType";
import { TFilter } from "./filterType";
import { TJewelry } from "./jewelryType";
import { TProject } from "./projectType";
import { TStatus } from "./statusType";
import { TUserExtra } from "./userExtraType";

export type TOrder = {
	id: number;
	orderDate: string;
	expectedDeliveryDate: string;
	actualDeliveryDate: string;
	specialRequests: string;
	status: TStatus;
	customerRating: number;
	totalPrice: number;
	budget: number;
	notes: string;
	project: TProject;
	customer: TUserExtra;
	jewelry: TJewelry | null;
	category: TCategory;
};
export type TOrderCreate = Partial<
	Omit<TOrder, "id" | "project" | "jewelry" | "customer" | "category">
> & {
	project?: { id: number };
	jewelry: { id: number } | null;
	customer: { id: number };
	category: { id: number };
};
export type TOrderQuery = {
	customer?: { id: TFilter };
	status?: TFilter;
};
