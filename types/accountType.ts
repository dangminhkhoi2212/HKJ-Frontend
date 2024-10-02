import { AUTHORIZATIONS_CONST } from "@/const";

import { TAudit } from "./auditType";

const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
type TPassword = {
  password: string;
};
type TConfirmPassword = {
  confirmPassword: string;
};
export type TSignIn = {
  username: string;
} & TPassword;
export type TFirstName = {
  firstName: string;
};
export type TLastName = {
  lastName: string;
};
export type TEmail = {
  email: string;
};
export type TPhone = {
  phone: string;
};

export type TAccontQuery = {
  role: keyof typeof AUTHORIZATIONS;
};

export type TAccountInfo = {
  id?: number;
  userId?: string;
  idKeyCloak?: string;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  phone?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  address?: string;
} & TAudit;
export type TAccountSync = {
  userId: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  authorities?: string[];
};
