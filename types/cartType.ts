import { TAccountInfo } from "./accountType";
import { TJewelry } from "./jewelryType";

export type CartType = {
	id: number;
	jewelry: TJewelry;
	customer: TAccountInfo;
};
