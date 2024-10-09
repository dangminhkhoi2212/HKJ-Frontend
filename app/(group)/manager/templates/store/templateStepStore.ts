import { TablePaginationConfig } from "antd";
import { create } from "zustand";

import { QUERY_CONST } from "@/const";
import { TQuery, TTemplate } from "@/types";

type TState = {
  query: TQuery;
  pagination: TablePaginationConfig;
  openDrawer: boolean;
  templateStepUpdate: TTemplate | null;
  toggleRefreshStep: boolean;
};
const initValues: TState = {
  query: { ...QUERY_CONST.defaultQuery, isDeleted: { equals: false } },
  pagination: QUERY_CONST.initPagination,
  templateStepUpdate: null,
  toggleRefreshStep: false,
  openDrawer: false,
};
type TActions = {
  setToggleRefreshStep: () => void;
  settemplateStepUpdate: (value: TTemplate) => void;
  setPagination: (value: TablePaginationConfig) => void;
  setQuery: (value: TQuery) => void;
  reset: () => void;
};

export const templateStepStore = create<TState & TActions>((set, get) => ({
  ...initValues,
  setToggleRefreshStep: () =>
    set({ toggleRefreshStep: !get().toggleRefreshStep }),
  settemplateStepUpdate: (value) => set({ templateStepUpdate: value }),
  setPagination(value) {
    set({ pagination: value });
  },
  setQuery(value) {
    set({ query: value });
  },
  reset: () => {
    set({ ...initValues });
  },
}));
