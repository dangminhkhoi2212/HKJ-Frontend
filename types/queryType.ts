import { TAudit } from "./auditType";
import { TPageType } from "./pageType";

export type TQuery<T = {}> = TPageType & TAudit & (T | null);
