import { Tag } from "antd";
import { ClipboardCheck, ClipboardPlus, Package, SquareX } from "lucide-react";

import { TPriority, TStatus } from "@/types";
import { TNotificationIcon } from "@/types/notificationIcon";

const TPriorityMapper = (key: TPriority): string => {
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
const TPriorityColorMapper = (key: TPriority): React.ReactNode => {
	switch (key) {
		case TPriority.LOW:
			return <Tag color="gold">Thấp</Tag>;
		case TPriority.MEDIUM:
			return <Tag color="blue">Trung bình</Tag>;
		case TPriority.HIGH:
			return <Tag color="red">Cao</Tag>;
		default:
			return <Tag color="gold">Thấp</Tag>;
	}
};
const TStatusMapper = (key: TStatus): string => {
	switch (key) {
		case TStatus.NEW:
			return "Chờ xử lý";
		case TStatus.IN_PROCESS:
			return "Đang xử lý";
		case TStatus.COMPLETED:
			return "Hoàn thành";
		case TStatus.DELIVERED:
			return "Đã giao";
		// case TStatus.LATED:
		// 	return "Trễ";
		case TStatus.CANCEL:
			return "Hủy";
		default:
			return "Chờ xử lý";
	}
};
const TStatusColorMapper = (key: TStatus): React.ReactNode => {
	switch (key) {
		case TStatus.NEW:
			return <Tag color="cyan">Chờ xử lý</Tag>;
		case TStatus.IN_PROCESS:
			return <Tag color="blue">Đang xử lý</Tag>;
		case TStatus.COMPLETED:
			return <Tag color="green">Hoàn thành</Tag>;
		case TStatus.DELIVERED:
			return <Tag color="geekblue">Đã giao</Tag>;
		// case TStatus.LATED:
		// 	return <Tag color="red">Trễ</Tag>;
		case TStatus.CANCEL:
			return <Tag color="red">Đã hủy</Tag>;
		default:
			return <Tag color="cyan">Mới</Tag>;
	}
};
const colorPriority = (priority: TPriority): string => {
	switch (priority) {
		case TPriority.LOW:
			return "#0079FF";
		case TPriority.MEDIUM:
			return "#06D001";
		case TPriority.HIGH:
			return "#FF6363";
		default:
			return "#F1D4D4";
	}
};

const TNotificationIconMapper = (icon: TNotificationIcon) => {
	switch (icon) {
		case TNotificationIcon.PLACE:
			return <ClipboardPlus color="#33b5e5" />;
		case TNotificationIcon.CANCEL:
			return <SquareX color="#ff4444" />;
		case TNotificationIcon.COMPLETED:
			return <ClipboardCheck color="#00c851" />;
		case TNotificationIcon.DELIVERED:
			return <Package color="#00c851" />;
		case TNotificationIcon.IN_PROCESS:
			return <Package color="#fbd009" />;
		default:
			return <ClipboardPlus />;
	}
};
const tagMapperUtil = {
	TPriorityMapper,
	TPriorityColorMapper,
	TStatusMapper,
	TStatusColorMapper,
	colorPriority,
	TNotificationIconMapper,
};
export default tagMapperUtil;
