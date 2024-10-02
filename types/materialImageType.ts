import { TAudit } from "./auditType";

export type TMaterialImage = {
  id: number;
  url: string;
} & TAudit;
export type TMaterialImageAdd = Pick<TMaterialImage, "url"> &
  TAudit & {
    material: Pick<TMaterialImageQuery, "id">;
  };

export type TMaterialImageUpdate = TMaterialImageAdd;
export type TMaterialImageQuery = { id?: number };
