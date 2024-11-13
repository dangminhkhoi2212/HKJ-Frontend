import { TAccountInfo } from "./accountType";
import { TFilter } from "./filterType";
import { TJewelry } from "./jewelryType";

export type TCart = {
	id: number;
	product: TJewelry;
	customer: TAccountInfo;
	quantity: number;
};
export type TCartCRUD = Partial<Omit<TCart, "customer" | "product">> & {
	product: { id: number };
	customer: { id: number };
};
export type TCartQuery = {
	customerId?: TFilter;
	productId?: TFilter;
};
