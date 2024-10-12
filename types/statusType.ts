export enum TStatus {
	NEW = "NEW",
	IN_PROCESS = "IN_PROCESS",
	COMPLETED = "COMPLETED",
	DELIVERED = "DELIVERED",
	LATED = "LATED",
}
export const TStatusMapper = (key: TStatus): string => {
	switch (key) {
		case TStatus.NEW:
			return "Mới";
		case TStatus.IN_PROCESS:
			return "Đang xử lý";
		case TStatus.COMPLETED:
			return "Hoàn thành";
		case TStatus.DELIVERED:
			return "Đã giao";
		case TStatus.LATED:
			return "Trễ";
		default:
			return "Mới";
	}
};
