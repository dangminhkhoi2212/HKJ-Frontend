export enum TPriority {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH",
}
export const TPriorityMapper = (key: TPriority): string => {
	switch (key) {
		case TPriority.LOW:
			return "Thấp";
		case TPriority.MEDIUM:
			return "Trung bình";
		case TPriority.HIGH:
			return "Cao";
		default:
			return "Thấp";
	}
};
