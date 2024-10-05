import { TAudit } from "./auditType";
import { TFilter } from "./filterType";
import { TImage } from "./imageType";

export type TMaterialImage = TImage & {
  id: number;
} & TAudit;
export type TMaterialImageAdd = Pick<TMaterialImage, "url"> &
  TAudit & {
    material: Pick<TMaterialImageQuery, "id">;
  };

export type TMaterialImageUpdate = TMaterialImageAdd;
export type TMaterialImageQuery = { id?: number; materialId?: TFilter };
