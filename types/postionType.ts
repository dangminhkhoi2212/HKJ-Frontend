import { TAudit } from "./auditType";
import { FormStatus } from "./formType";

export type TPositionCreate = {
  name: string;
};
export type TPosition = {
  id?: number;
  name?: string;
} & TAudit;

export type TSelectedPosition = {
  show: boolean;
  status?: FormStatus;
  record?: TPosition;
};

export type TPositionQuery = {
  "name.contains"?: string;
};
