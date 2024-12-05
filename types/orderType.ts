import { TFilter } from './filterType';
import { TJewelry } from './jewelryType';
import { TProject } from './projectType';
import { TStatus } from './statusType';
import { TUserExtra } from './userExtraType';

export type TCartItemSession = {
	id: number;
	coverImage: string;
	quantity: number;
	price: number;
};
export type TOrder = {
	id: number;
	quantity: number;
	orderDate: string;
	expectedDeliveryDate: string;
	actualDeliveryDate: string;
	specialRequests: string;
	status: TStatus;
	customerRating: number;
	totalPrice: number|null;
	budget: number;
	notes: string;
	project: TProject;
	customer: TUserExtra;
	jewelry: TJewelry | null;
};
export type TOrderCreate = Partial<
	Omit<TOrder, "id" | "project" | "jewelry" | "customer">
> & {
	project?: { id: number } | null;
	jewelry?: { id: number } | null;
	customer: { id: number } | null;
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
