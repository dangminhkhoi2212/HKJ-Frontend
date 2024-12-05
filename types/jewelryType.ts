import { TAudit } from "./auditType";
import { TCategory } from "./categoryType";
import { TEmployee } from "./employeeType";
import { TFilter } from "./filterType";
import { TMaterialUsage } from "./materialUsageType";
import { TProject } from "./projectType";
import { TUserExtra } from "./userExtraType";

export type TJewelry = {
	id: number;
	sku: string;
	name: string;
	manager: TUserExtra;
	description?: string;
	isCoverSearch?: boolean;
	price: number;
	coverImage: string;
	active: boolean;
	category: TCategory;
	project: TProject;
	materials?: TMaterialUsage[] | null;
} & TAudit;

export type TJewelryCRUD = Omit<
	TJewelry,
	"project" | "materials" | "category" | "manager"
> & {
	project?: Pick<TProject, "id"> | null;
	category?: Pick<TCategory, "id"> | null;
	manager?: Pick<TUserExtra, "id"> | null;
};
export type TJewelryCreate = Omit<TJewelryCRUD, "id">;

export type TJewelryUpdate = Omit<
	TJewelry,
	"manager" | "category" | "project" | "materials"
> & {
	category: Pick<TCategory, "id">;
	project: Pick<TProject, "id">;
	manager: Pick<TEmployee, "id">;
};
export type TJewelryUpdateImages = {
	id: number;
	coverImage: string;
};
export type TJewelryUpdateBasic = Omit<
	TJewelry,
	"manager" | "category" | "coverImage" | "project"
> & {
	category: Pick<TCategory, "id">;
};
export type TJewelryUpdateProject = {
	id: number;
	project?: { id: number };
};
export type TJewelryUpdatePartical = Partial<TJewelry>;
export type TJewelryQuery = {
	name?: TFilter;
	price?: TFilter;
	categoryId?: TFilter;
	materialId?: TFilter;
	isCoverSearch?: TFilter;
	active?: TFilter;
	id?: TFilter;
};
