import { TFilter } from "./filterType";
import { TOrder } from "./orderType";

export type TOrderImage = {
	id: number;
	url: string;
	orderItem: TOrder;
};
export type TOrderImageCreate = {
	url: string;
	orderItem: { id: number };
};
export type TOrderImageQuery = {
	orderItemId?: TFilter;
};
