import { TPosition } from "./postionType";
import { TUserExtra } from "./userExtraType";

export type THire = {
  id: number;
  beginDate: string;
  endDate: string;
  beginSalary: number;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  position: TPosition;
  employee: TUserExtra;
};
