import { TablePaginationConfig } from "antd";
import { create } from "zustand";

import { QUERY_CONST } from "@/const";
import { TQuery, TTemplate, TTemplateQuery } from "@/types";

type TTypeForm = "add" | "update" | "delete" | null;
type TState = {
	query: TQuery;
	pagination: TablePaginationConfig;
	openDrawer: boolean;
	toggleRefresh: boolean;
	templateCreate: TTemplate | null;
	templateUpdate: TTemplate | null;
	templateDelete: TTemplate | null;
};
const initValues: TState = {
	query: { ...QUERY_CONST.defaultQuery, isDeleted: { equals: false } },
	pagination: QUERY_CONST.initPagination,
	openDrawer: false,
	toggleRefresh: false,
	templateCreate: null,
	templateDelete: null,
	templateUpdate: null,
};
type TActions = {
	setToggleRefresh: () => void;
	setOpenDrawer: (value: boolean) => void;
	setPagination: (value: TablePaginationConfig) => void;
	setQuery: (value: TQuery<TTemplateQuery>) => void;
	setTemplateCreate: (value: TTemplate | null) => void;
	setTemplateDelete: (value: TTemplate | null) => void;
	setTemplateUpdate: (value: TTemplate | null) => void;
	reset: () => void;
};

export const projectStore = create<TState & TActions>((set, get) => ({
	...initValues,
	setToggleRefresh: () => set({ toggleRefresh: !get().toggleRefresh }),
	setOpenDrawer: (value) => {
		set({ openDrawer: value });
	},
	setPagination: (value) => set({ pagination: value }),
	setQuery: (value) => set({ query: value }),
	setTemplateUpdate: (value) => set({ templateUpdate: value }),
	setTemplateDelete: (value) => set({ templateDelete: value }),
	setTemplateCreate: (value) => set({ templateCreate: value }),

	reset: () => {
		set({ ...initValues });
	},
}));
