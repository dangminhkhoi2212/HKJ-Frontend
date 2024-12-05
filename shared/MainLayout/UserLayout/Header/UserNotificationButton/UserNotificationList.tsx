import { App, Badge, Button, Popover, Spin } from "antd";
import { Bell } from "lucide-react";
import React, { useState } from "react";

import { useAccountStore } from "@/providers";
import notificationService from "@/services/notificationService";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { NotificationCard } from "@/shared/Notification";
import { useMutation } from "@tanstack/react-query";

import { userNotificationStore } from "./UserNotificationStore";

type Props = {};

const NotificationList: React.FC<Props> = ({}) => {
	const { notifications, notificationsCount, reset } =
		userNotificationStore();
	const account = useAccountStore((state) => state.account);
	const message = App.useApp().message;
	const [open, setOpen] = useState(false);

	const handelClearAll = useMutation({
		mutationFn: () => {
			return notificationService.clearAll({ accountId: account?.id! });
		},
		onSettled(data, error, variables, context) {
			reset();
		},
		onError(error, variables, context) {
			message.error(
				"Đã có lỗi xảy ra khi xóa thông báo. Xin vui lòng thử lại."
			);
		},
	});
	return (
		<Spin spinning={handelClearAll.isPending}>
			<Popover
				open={open}
				title={
					<div className="flex justify-between">
						<p>Thông báo</p>
						<Button
							onClick={() => handelClearAll.mutate()}
							loading={handelClearAll.isPending}
							disabled={notifications?.length === 0}
						>
							Xóa hết
						</Button>
					</div>
				}
				onOpenChange={(newOpen) => setOpen(newOpen)}
				content={
					<div className="w-80 h-[400px] overflow-y-auto flex flex-col gap-1">
						{notifications?.length ? (
							notifications?.map((item: any) => (
								<NotificationCard
									data={item}
									key={item.id || Date.now()}
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
		</Spin>
	);
};

export default NotificationList;
