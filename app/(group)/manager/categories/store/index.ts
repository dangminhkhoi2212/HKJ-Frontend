import { TablePaginationConfig } from "antd";
import { create } from "zustand";

import { QUERY_CONST } from "@/const";
import { TCategory, TQuery } from "@/types";

type TState = {
	query: TQuery;
	pagination: TablePaginationConfig;
	openDrawer: boolean;
	toggleRefresh: boolean;
	categoryUpdate: TCategory;
	categoryDelete: TCategory;
};
type TActions = {
	setToggleRefresh: () => void;
	setOpenDrawer: (value: boolean) => void;
	setCategoryUpdate: (value: TCategory) => void;
	setCategoryDelete: (value: TCategory) => void;
	setPagination: (value: TablePaginationConfig) => void;
	setQuery: (value: TQuery) => void;
	reset: () => void;
};

const initValues: TState = {
	query: { ...QUERY_CONST.defaultQuery, isDeleted: { equals: false } },
	pagination: QUERY_CONST.initPagination,
	categoryUpdate: {} as TCategory,
	categoryDelete: {} as TCategory,
	openDrawer: false,
	toggleRefresh: false,
};
const categoryStore = create<TState & TActions>((set, get) => ({
	...initValues,
	setToggleRefresh: () => set({ toggleRefresh: !get().toggleRefresh }),
	setOpenDrawer: (value) => {
		set({ openDrawer: value });
	},
	setCategoryUpdate: (value) => set({ categoryUpdate: value }),
	setCategoryDelete: (value) => set({ categoryDelete: value }),
	setPagination: (value) =>
		set({ pagination: { ...get().pagination, ...value } }),
	setQuery: (value) => set({ query: { ...get().query, ...value } }),
	reset: () => {
		console.log("reset");

		set({ ...initValues });
	},
}));

export default categoryStore;
