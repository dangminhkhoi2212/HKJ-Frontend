export type TFilter = {
  contains?: string;
  doesNotContain?: string;
  equals?: string | boolean | number;
  notEquals?: string;
  in?: string[];
  notIn?: string[];
  greaterThan?: string;
  lessThan?: string;
  greaterThanOrEqual?: string;
  specified?: boolean;
};
