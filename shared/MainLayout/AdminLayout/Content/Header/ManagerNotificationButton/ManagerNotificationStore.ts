import { create } from "zustand";

import { TNotification } from "@/types/notificationType";

type TState = {
	notifications: TNotification[];
	notificationsCount: number;
	open: boolean;
};
type TActions = {
	reset: () => void;
	setNotifications: (notifications: any) => void;
	resetNotifications: () => void;
	setOpen: (open: boolean) => void;
	setNotificationsCount: (notificationsCount: number) => void;
};

const initValues: TState = {
	open: false,
	notifications: [],
	notificationsCount: 0,
};
export const managerNotificationStore = create<TState & TActions>(
	(set, get) => ({
		...initValues,

		setNotifications: (notifications: TNotification[]) => {
			const oldNotis = get().notifications || [];
			// Loại bỏ trùng lặp dựa trên key
			const mergedNotifications = [
				...(notifications || []),
				...(oldNotis || []),
			].reduce((acc: any, item: TNotification) => {
				if (!item) return acc; // Bỏ qua item null hoặc undefined
				const exists = acc.find((i: any) => i?.id === item?.id);
				return exists ? acc : [...acc, item];
			}, [] as TNotification[]);

			set({
				notifications: mergedNotifications,
			});
		},
		resetNotifications: () => {
			set({ notifications: [] });
		},
		setNotificationsCount: (notificationsCount: number) => {
			set({ notificationsCount });
		},
		setOpen(open) {
			set({ open });
		},
		reset: () => {
			set({ ...initValues });
		},
	})
);
