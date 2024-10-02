import { TAudit } from "./auditType";
import { TPageType } from "./pageType";

export type TQuery<T = any> = TPageType & TAudit & T;
