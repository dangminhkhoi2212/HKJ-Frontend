import { getSupbaseInstance } from "@/config";
import {
	NotificationType,
	TGetNotification,
	TNotificationCRUD,
} from "@/types/notificationType";
import { SupabaseClient } from "@supabase/supabase-js";

class NotificationService {
	private static instance: NotificationService;
	private tableName = "notifications";
	client: SupabaseClient<any, "public", any>;
	constructor() {
		this.client = getSupbaseInstance();
	}
	public static getInstance(): NotificationService {
		if (!NotificationService.instance) {
			NotificationService.instance = new NotificationService();
		}
		return NotificationService.instance;
	}

	async getNotifications(query: TGetNotification) {
		const response = await this.client
			.from("notifications")
			.select("*")
			.eq("type", NotificationType.USER)
			.eq("receiver_id", query.accountId)
			.eq("is_deleted", false)
			.order("created_at", { ascending: false });
		return response.data;
	}
	async getNotificationsCount(query: TGetNotification) {
		const response = await this.client
			.from(this.tableName)
			.select("*", { count: "exact", head: true })
			.eq("receiver_id", query.accountId)
			.eq("type", NotificationType.USER)
			.eq("is_read", false)
			.eq("is_deleted", false)
			.order("created_at", { ascending: false });

		// Check if response has an error
		console.log(
			"🚀 ~ NotificationService ~ getNotificationsCount ~ response:",
			response.count
		);
		if (response.error) {
			return 0; // or handle the error as needed
		}

		return response.count || 0; // Ensure a default return value
	}
	async getNotificationsForManager(query?: TGetNotification) {
		const response = await this.client
			.from("notifications")
			.select("*")
			.eq("type", NotificationType.MANAGER)
			.eq("is_deleted", false)
			.order("created_at", { ascending: false });
		return response.data;
	}
	async getNotificationsCountForManager(query?: TGetNotification) {
		const response = await this.client
			.from(this.tableName)
			.select("*", { count: "exact", head: true })
			.eq("type", NotificationType.MANAGER)
			.eq("is_read", false)
			.eq("is_deleted", false)
			.order("created_at", { ascending: false });

		// Check if response has an error
		if (response.error) {
			console.error(
				"Error fetching notifications count:",
				response.error
			);
			return 0; // or handle the error as needed
		}

		return response.count || 0; // Ensure a default return value
	}

	async createNotification(data: TNotificationCRUD) {
		const response = await this.client
			.from(this.tableName)
			.insert({ ...data, is_deleted: false });
		return response.data;
	}
	async updateNotification(data: TNotificationCRUD) {
		const response = await this.client
			.from(this.tableName)
			.update(data)
			.eq("id", data.id)
			.eq("is_deleted", false);
		return response.data;
	}
	async clearAll(query: TGetNotification) {
		const response = await this.client
			.from(this.tableName)
			.update({ is_deleted: true })

			.eq(
				query?.role === "user" ? "receiver_id" : "sender_id",
				query.accountId
			);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data;
	}
}
const notificationService = NotificationService.getInstance();
export default notificationService;
