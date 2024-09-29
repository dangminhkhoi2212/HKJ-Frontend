export type TFilter = {
  contains?: string;
  doesNotContain?: string;
  equals?: string;
  notEquals?: string;
  in?: string[];
  notIn?: string[];
  greaterThan?: string;
  lessThan?: string;
  greaterThanOrEqual?: string;
  specified?: boolean;
};
