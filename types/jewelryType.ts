import { TCategory } from './categoryType';
import { TEmployee } from './employeeType';
import { TFilter } from './filterType';
import { TProject } from './projectType';
import { TUserExtra } from './userExtraType';

export type TJewelry = {
	id: number;
	name: string;
	color: string;
	weight: number;
	manager: TUserExtra;
	description?: string;
	category: TCategory;
	isCustom: boolean;
	price: number;
	coverImage: string;
	active: boolean;
	project: TProject;
};
export type TJewelryCreate = Omit<
	TJewelry,
	"id" | "manager" | "category" | "coverImage" | "project"
> & {
	category: Pick<TCategory, "id">;
};
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
export type TJewelryQuery = { name?: TFilter };
