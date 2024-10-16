import { TAccountInfo } from "./accountType";
import { TFilter } from "./filterType";

export type TEmployee = TAccountInfo;
export type TEmployeeQuery = {
	name?: TFilter;
};
