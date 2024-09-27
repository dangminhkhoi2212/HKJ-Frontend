import { TAudit } from "./auditType";
import { TUser } from "./userType";

export type TUserExtra = {
  id?: number;
  phone?: string;
  address?: string;
  user: TUser;
} & TAudit;
