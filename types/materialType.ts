import { TAudit } from "./auditType";

export type TMaterial = {
	id: number;
	name: string;
	unit: string;
	pricePerUnit: number;
	coverImage: string;
} & TAudit;

export type TMaterialAdd = Omit<TMaterial, "id">;
export type TMaterialUpadate = Partial<TMaterial>;

export type TMaterialQuery = {
	id?: number;
};
