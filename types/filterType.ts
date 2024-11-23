export type TFilter = {
	contains?: string | number | null;
	doesNotContain?: string | number | null;
	equals?: string | number | boolean | number | null;
	notEquals?: string | number | null;
	in?: string[] | number[] | null;
	notIn?: string | number[] | null;
	greaterThan?: string | number | null;
	lessThan?: string | number | null;
	greaterThanOrEqual?: string | number | null;
	lessThanOrEqual?: string | number | null;
	specified?: boolean | null;
};
