import { TAudit } from "./auditType";
import { TMaterialImage } from "./materialImageType";

export type TMaterial = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  coverImage: string;
  images: TMaterialImage[];
} & TAudit;

export type TMaterialAdd = Omit<TMaterial, "id" | "images">;
export type TMaterialUpadate = Omit<TMaterial, "images">;

export type TMaterialQuery = {
  id?: number;
};
