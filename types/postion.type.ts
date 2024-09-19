import { TAudit } from "./audit.type";
import { FormStatus } from "./form.type";
import { TPageType } from "./page.type";

export type TPositionCreate = {
  name: string;
};
export type TPosition = {
  id: number;
  name: string;
} & TAudit;

export type TSelectedPosition = {
  show: boolean;
  status?: FormStatus;
  record?: TPosition;
};

export type TPositionQuery = {
  "name.contains"?: string;
} & TPageType;
