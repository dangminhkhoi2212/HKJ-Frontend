import { TCategory } from "./categoryType";
import { TProject } from "./projectType";
import { TUserExtra } from "./userExtraType";

export type TJewelry = {
	id: number;
	name: string;
	color: string;
	wieght: number;
	manager: TUserExtra;
	description?: string;
	category: TCategory;
	isCustom: boolean;
	price: number;
	coverImage: string;
	project: TProject;
};
export type TJewelryCreate = Omit<
	TJewelry,
	"id" | "manager" | "category" | "coverImage" | "project"
> & {
	category: Pick<TCategory, "id">;
};
export type TJewelryQuery = {};
