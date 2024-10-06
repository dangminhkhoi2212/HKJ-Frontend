import { TAuditFilter } from './auditType';
import { TPageType } from './pageType';

export type TQuery<T = any> = TPageType & TAuditFilter & T;
