import { TCategory } from "./categoryType";
import { TFilter } from "./filterType";
import { TJewelry } from "./jewelryType";
import { TMaterial } from "./materialType";
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
	material: TMaterial;
};
export type TOrderCreate = Partial<
	Omit<
		TOrder,
		"id" | "project" | "jewelry" | "customer" | "category" | "material"
	>
> & {
	project?: { id: number } | null;
	jewelry?: { id: number } | null;
	customer: { id: number } | null;
	category?: { id: number } | null;
	material?: { id: number } | null;
};
export type TOrderUpdate = Partial<TOrderCreate> & { id: number };
export type TOrderQuery = {
	customerId?: TFilter;
	status?: TFilter;
	id?: TFilter;
	orderDate?: TFilter;
	expectedDeliveryDate?: TFilter;
	actualDeliveryDate?: TFilter;
};
