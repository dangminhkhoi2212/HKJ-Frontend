interface SortOption {
	asc: string;
	desc: string;
}
type SortField = "lastModifiedDate" | "createdDate" | "id";
const createSortOption = (field: SortField): SortOption | undefined => {
	return {
		asc: `${field},asc`,
		desc: `${field},desc`,
	};
};

const queryUtil = {
	createSortOption,
};

export default queryUtil;
