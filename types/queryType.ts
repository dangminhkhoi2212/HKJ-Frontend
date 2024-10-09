import { TAuditFilter } from './auditType';
import { TPageType } from './pageType';

export type TQuery<T = {}> = TPageType & TAuditFilter & T;
