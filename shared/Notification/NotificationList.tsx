import { Badge, Button, Popover } from "antd";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";

import { EmptyCustom } from "@/shared/EmptyCustom";
import { NotificationCard } from "@/shared/Notification";

import { userNotificationStore } from "./UserNotificationStore";

type Props = {};

const NotificationList: React.FC<Props> = ({}) => {
	const { notifications, notificationsCount } = userNotificationStore();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		console.log("🚀 ~ notifications-children:", notifications);
		console.log("🚀 ~ open:", open);
	}, [notifications, open]);

	return (
		<Popover
			open={open}
			onOpenChange={(newOpen) => setOpen(newOpen)}
			content={
				<div className="w-80 h-[400px] overflow-y-auto flex flex-col gap-1">
					{notifications?.length ? (
						notifications?.map((item: any) => (
							<NotificationCard
								data={item.label}
								key={item.id}
								setOpen={setOpen}
							/>
						))
					) : (
						<EmptyCustom />
					)}
				</div>
			}
			key={notifications?.length}
			trigger="click"
		>
			<Badge count={notificationsCount} size="default">
				<Button icon={<Bell size={14} />} />
			</Badge>
		</Popover>
	);
};

export default NotificationList;
