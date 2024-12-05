"use client";

import { Spin } from "antd";
import React, { useEffect } from "react";

import { getSupbaseInstance } from "@/config";
import { useAccountStore } from "@/providers";
import notificationService from "@/services/notificationService";
import { NotificationType, TNotification } from "@/types/notificationType";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useQueries } from "@tanstack/react-query";

import NotificationList from "./UserNotificationList";
import { userNotificationStore } from "./UserNotificationStore";

type Props = {};

const supabase = getSupbaseInstance();
const UserNotificationButton: React.FC<Props> = () => {
	const { setNotifications, setNotificationsCount } = userNotificationStore();
	const account = useAccountStore((state) => state.account);

	// React Query hooks for fetching notifications and counts
	const [
		{
			data: initNotifications,
			refetch: refetchNotifications,
			isLoading: loadingNotifications,
		},
		{
			data: notificationsCount,
			refetch: refetchNotificationCount,
			isLoading: loadingNotificationCount,
		},
	] = useQueries({
		queries: [
			{
				queryKey: ["notifications"],
				queryFn: () =>
					notificationService.getNotifications({
						accountId: account?.id!,
					}),
				enabled: false,
			},
			{
				queryKey: ["notifications-count"],
				queryFn: () =>
					notificationService.getNotificationsCount({
						accountId: account?.id!,
					}),
				enabled: false,
			},
		],
	});

	useEffect(() => {
		refetchNotifications();
		refetchNotificationCount();
	}, []);

	const handleRealtimeNotification = (
		payload: RealtimePostgresInsertPayload<any>
	) => {
		const newNotification: TNotification = payload.new;

		if (
			newNotification.receiver_id === account?.id &&
			newNotification.type === NotificationType.USER
		) {
			setNotifications([newNotification]);
			refetchNotificationCount();
		}
	};

	// Setup Supabase Realtime listeners
	useEffect(() => {
		const channel = supabase.channel("notifications");

		channel
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "notifications" },
				(payload) => handleRealtimeNotification(payload)
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "notifications" },
				() => refetchNotificationCount()
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);

	// Initialize notifications on load
	useEffect(() => {
		if (initNotifications?.length) {
			setNotifications(initNotifications);
		}
	}, [initNotifications]);

	useEffect(() => {
		if (notificationsCount) {
			setNotificationsCount(notificationsCount);
		}
	}, [notificationsCount]);

	return (
		<Spin spinning={loadingNotifications}>
			<NotificationList />
		</Spin>
	);
};

export default UserNotificationButton;
