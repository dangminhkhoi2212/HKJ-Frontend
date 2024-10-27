import { TablePaginationConfig } from "antd";

import { TQuery } from "@/types";

interface SortOption {
	asc: string;
	desc: string;
}
type SortField = "lastModifiedDate" | "createdDate" | "id";
const createSortOption = (field?: SortField): SortOption | undefined => {
	if (!field?.trim()) {
		return undefined;
	}

	const normalizedField = field.trim();

	return {
		asc: `${normalizedField},asc`,
		desc: `${normalizedField},desc`,
	};
};

const PAGE: number = 0;
const PAGE_SIZE: number = 20;
const DEFAULT_CURRENT_PAGE: number = 1;
const initPagination: TablePaginationConfig = {
	pageSize: PAGE_SIZE,
	defaultCurrent: DEFAULT_CURRENT_PAGE,
	current: DEFAULT_CURRENT_PAGE,
};

const defaultQuery: TQuery = {
	page: PAGE,
	size: PAGE_SIZE,

	sort: createSortOption("lastModifiedDate")?.desc,
	isDeleted: { equals: false },
};
const queryConst = {
	initPagination,
	defaultQuery,
	createSortOption,
};
export default queryConst;
