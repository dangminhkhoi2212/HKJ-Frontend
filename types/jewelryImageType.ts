import { TAudit } from "./auditType";
import { TFilter } from "./filterType";
import { TImage } from "./imageType";
import { TJewelry } from "./jewelryType";

export type TJewelryImage = TImage & {
	jewelryModel: TJewelry;
	isSearchImage: boolean;
} & TAudit;
export type TJewelryImageCreate = Omit<TJewelryImage, "id" | "jewelryModel"> & {
	jewelryModel: { id: number };
};
export type TJewelryImageQuery = { jewelryModelId?: TFilter };
