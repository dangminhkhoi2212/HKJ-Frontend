import { TablePaginationConfig } from "antd";

import { TQuery } from "@/types";

const PAGE: number = 0;
const PAGE_SIZE: number = 5;
const DEFAULT_CURRENT_PAGE: number = 1;
const initPagination: TablePaginationConfig = {
  pageSize: PAGE_SIZE,
  defaultCurrent: DEFAULT_CURRENT_PAGE,
  current: DEFAULT_CURRENT_PAGE,
};

const initQuery: TQuery = {
  page: PAGE,
  size: PAGE_SIZE,
};
const queryConst = {
  initPagination,
  initQuery,
};
export default queryConst;
