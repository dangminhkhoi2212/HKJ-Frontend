import { TAudit } from "./auditType";

export type TMaterial = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  coverImage: string;
} & TAudit;

export type TMaterialAdd = TMaterial;
export type TMaterialUpadate = Partial<TMaterial>;

export type TMaterialQuery = {
  id?: number;
};
