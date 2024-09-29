const createSortOption = (
  field: string | "lastModifiedDate" | "createdDate" | "id"
): { asc: string; desc: string } => ({
  asc: `${field},asc`,
  desc: `${field},desc`,
});

const queryUtitl = { createSortOption };
export default queryUtitl;
