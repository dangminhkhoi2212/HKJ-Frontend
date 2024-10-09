import { TFilter } from "./filterType";
import { TTemplate } from "./templateType";

export type TTemplateStep = {
  id: number;
  name: string;
  hkjTemplate: Pick<TTemplate, "id">;
};
export type TTemplateStepCreate = Omit<TTemplateStep, "id">;

export type TTemplateStepQuery = {
  hkjTemplateId?: TFilter;
};
