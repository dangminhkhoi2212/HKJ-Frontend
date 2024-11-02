import { TAudit } from "./auditType";
import { TCategory } from "./categoryType";
import { TEmployee } from "./employeeType";
import { TFilter } from "./filterType";
import { TMaterial } from "./materialType";
import { TProject } from "./projectType";
import { TUserExtra } from "./userExtraType";

export type TJewelry = {
	id: number;
	sku: string;
	name: string;
	color: string;
	weight: number;
	manager: TUserExtra;
	description?: string;
	isCustom: boolean;
	isCoverSearch?: boolean;
	price: number;
	coverImage: string;
	active: boolean;
	category: TCategory;
	project: TProject;
	material: TMaterial;
} & TAudit;

export type TJewelryCRUD = Omit<
	TJewelry,
	"project" | "material" | "category" | "manager"
> & {
	project?: Pick<TProject, "id"> | null;
	category?: Pick<TCategory, "id"> | null;
	material?: Pick<TMaterial, "id"> | null;
	manager?: Pick<TUserExtra, "id"> | null;
};
export type TJewelryCreate = Omit<TJewelryCRUD, "id">;

export type TJewelryUpdate = Omit<
	TJewelry,
	"manager" | "category" | "project"
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
	isCoverSearch?: TFilter;
};
