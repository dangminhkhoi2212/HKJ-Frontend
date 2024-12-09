import { TablePaginationConfig } from "antd";
import { create } from "zustand";

import { QUERY_CONST } from "@/const";
import { TJewelryQuery, TQuery } from "@/types";

type TState = {
	query: TQuery<TJewelryQuery>;
	pagination: TablePaginationConfig;
	toggleRefresh: boolean;
};
const initValues: TState = {
	query: {
		...{ ...QUERY_CONST.defaultQuery, sort: "createdDate,desc" },
		isDeleted: { equals: false },
		active: { equals: true },
		size: 30,
	},
	pagination: {
		...QUERY_CONST.initPagination,
		pageSize: 30,
	},
	toggleRefresh: false,
};
type TActions = {
	setToggleRefresh: () => void;
	setPagination: (value: TablePaginationConfig) => void;
	setQuery: (value: TQuery<TJewelryQuery>) => void;
	reset: () => void;
};

export const projectStore = create<TState & TActions>((set, get) => ({
	...initValues,
	setToggleRefresh: () => set({ toggleRefresh: !get().toggleRefresh }),

	setPagination: (value) =>
		set({ pagination: { ...get().pagination, ...value } }),

	setQuery: (value) => set({ query: { ...get().query, ...value } }),

	reset: () => {
		set({ ...initValues });
	},
}));
