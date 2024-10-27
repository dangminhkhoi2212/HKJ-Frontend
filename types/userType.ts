import { TAudit } from "./auditType";

export type TUser = {
	id: string | null | undefined;
	login: string | null | undefined;
	firstName: string | null | undefined;
	lastName: string | null | undefined;
	email: string | null | undefined;
	authorities: string[] | null | undefined;
} & TAudit;
