import { TablePaginationConfig } from 'antd';
import { create } from 'zustand';

import { QUERY_CONST } from '@/const';
import { TProject, TProjectQuery, TQuery } from '@/types';

type TTypeForm = "add" | "update" | "delete" | null;
type TState = {
	query: TQuery<TProjectQuery>;
	pagination: TablePaginationConfig;
	openDrawer: boolean;
	toggleRefresh: boolean;
	templateCreate: TProject | null;
	templateUpdate: TProject | null;
	templateDelete: TProject | null;
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
	setQuery: (value: TQuery<TProjectQuery>) => void;
	setTemplateCreate: (value: TProject | null) => void;
	setProjectDelete: (value: TProject | null) => void;
	setTemplateUpdate: (value: TProject | null) => void;
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
	setProjectDelete: (value) => set({ templateDelete: value }),
	setTemplateCreate: (value) => set({ templateCreate: value }),

	reset: () => {
		set({ ...initValues });
	},
}));
