import { TAudit } from "./auditType";
import { TFilter } from "./filterType";

export type TCategory = {
	id: number;
	name: string;
} & TAudit;
export type TCategoryQuery = {
	name?: TFilter;
};
