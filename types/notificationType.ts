import { TNotificationIcon } from "./notificationIcon";

export type TGetNotification = {
	accountId: number | null;
	role?: "user" | "manager";
};
export enum NotificationType {
	USER = "user",
	MANAGER = "manager",
}
export type TNotification = {
	id: number;
	sender_id: number;
	receiver_id: number;
	icon: TNotificationIcon;
	content: string;
	created_at: string;
	is_read: boolean;
	url: string;
	is_deleted: boolean;
	type: NotificationType;
};
export type TNotificationCRUD = Partial<TNotification>;
