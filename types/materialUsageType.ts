import { TAudit } from "./auditType";
import { TFilter } from "./filterType";
import { TJewelry } from "./jewelryType";
import { TMaterial } from "./materialType";

export type TMaterialUsage = {
	id: number;
	material: TMaterial;
	usage: number;
	price: number;
	jewelry: TJewelry;
} & TAudit;
type TMaterialUsageCRUD = Partial<
	Omit<TMaterialUsage, "jewelry" | "material">
> & {
	jewelry: { id: number };
	material: { id: number };
};
export type TMaterialUsageCreate = Omit<TMaterialUsageCRUD, "id">;
export type TMaterialUsageUpdate = TMaterialUsageCRUD;
export type TMaterialUsageQuery = {
	jewelryId?: TFilter;
	materialId?: TFilter;
};
