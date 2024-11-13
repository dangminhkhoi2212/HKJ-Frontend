import { TCategory } from "./categoryType";
import { TFilter } from "./filterType";
import { TJewelry } from "./jewelryType";
import { TMaterial } from "./materialType";
import { TOrderImage } from "./orderImageType";
import { TOrder } from "./orderType";
import { TProject } from "./projectType";

export type TOrderItem = {
	id: number;
	quantity: number;
	specialRequests: string;
	price: number | null;
	notes: string;
	project: TProject;
	jewelry: TJewelry | null;
	category: TCategory;
	material: TMaterial;
	order: TOrder;
	images?: TOrderImage[];
};
export type TOrderItemCreate = Partial<
	Omit<
		TOrderItem,
		| "id"
		| "project"
		| "jewelry"
		| "customer"
		| "category"
		| "material"
		| "order"
	>
> & {
	order: { id: number };
	project: { id: number } | null;
	jewelry: { id: number } | null;
	category: { id: number } | null;
	material: { id: number } | null;
};
export type TOrderItemUpdate = Partial<TOrderItemCreate> & { id: number };
export type TOrderItemQuery = {
	id?: TFilter;
	orderId?: TFilter;
};
