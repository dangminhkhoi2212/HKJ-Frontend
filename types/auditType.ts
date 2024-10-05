import { TFilter } from "./filterType";

export type TAudit = {
  isDeleted?: boolean;
  createdBy?: string;
  createdDate?: string | "asc" | "desc";
  lastModifiedBy?: string;
  lastModifiedDate?: string | "asc" | "desc";
};
export type TAuditFilter = {
  isDeleted?: TFilter;
  createdBy?: TFilter;
  createdDate?: TFilter;
  lastModifiedBy?: TFilter;
  lastModifiedDate?: TFilter;
};
