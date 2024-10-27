import { TFilter } from "./filterType";
import { TPosition } from "./postionType";
import { TUserExtra } from "./userExtraType";

export interface THire {
	id: number;
	beginDate: string;
	endDate: string;
	beginSalary: number;
	isDeleted: any;
	createdBy: string;
	createdDate: string;
	lastModifiedBy: string;
	lastModifiedDate: string;
	position: Pick<TPosition, "id" | "name">;
	employee: TUserExtra;
}

export type THireQuery = {
	positionName?: TFilter;
	employeeName?: TFilter;
};
