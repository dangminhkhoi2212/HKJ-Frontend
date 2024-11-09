export type TFilter = {
	contains?: string | number;
	doesNotContain?: string | number;
	equals?: string | number | boolean | number;
	notEquals?: string | number;
	in?: string[] | number[];
	notIn?: string | number[];
	greaterThan?: string | number;
	lessThan?: string | number;
	greaterThanOrEqual?: string | number;
	lessThanOrEqual?: string | number;
	specified?: boolean;
};
