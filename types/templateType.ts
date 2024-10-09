import { TCategory } from "./categoryType";
import { TFilter } from "./filterType";

export type TTemplate = {
  id: number;
  name: string;
  category: TCategory;
};
export type TTemplateCreate = {
  name: string;
  category: { id: number };
};
export type TTemplateUpdate = {
  id: number;
  name: string;
  category: Pick<TCategory, "id">;
};
export type TTemplateQuery = {
  name?: TFilter;
};
