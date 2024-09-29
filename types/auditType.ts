export type TAudit = {
  isDeleted?: boolean;
  createdBy?: string;
  createdDate?: string | "asc" | "desc";
  lastModifiedBy?: string;
  lastModifiedDate?: string | "asc" | "desc";
};
