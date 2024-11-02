import { TFilter } from "./filterType";
import { TOrder } from "./orderType";

export type TOrderImage = {
	id: number;
	url: string;
	order: TOrder;
};
export type TOrderImageCreate = {
	url: string;
	order: { id: number };
};
export type TOrderImageQuery = {
	orderId?: TFilter;
};
