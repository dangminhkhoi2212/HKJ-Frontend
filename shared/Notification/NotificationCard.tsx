import Link from "next/link";
import React, { memo, useEffect, useState } from "react";

import notificationService from "@/services/notificationService";
import { TNotification } from "@/types/notificationType";
import { cn, formatUtil, tagMapperUtil } from "@/utils";
import { useMutation } from "@tanstack/react-query";

type Props = {
	data: TNotification;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
const { formatDate } = formatUtil;
const NoticationCard: React.FC<Props> = ({ data, setOpen }) => {
	const [isRead, setIsRead] = useState<boolean>(false);
	useEffect(() => {
		setIsRead(data.is_read);
	}, [data.is_read]);
	const updateReadStaus = useMutation({
		mutationFn: () =>
			notificationService.updateNotification({ ...data, is_read: true }),
		onSuccess: () => {
			setIsRead(true);
			setOpen && setOpen(false);
		},
		onError: () => {},
	});
	return (
		<Link
			href={data?.url ?? "/"}
			className="text-black"
			onClick={() => updateReadStaus.mutate()}
			key={data.id}
		>
			<div
				className={cn(
					"w-full block rounded-lg border m-0 p-2",
					isRead ? "" : "bg-primary-950/50"
				)}
			>
				<div className="flex flex-col  gap-2 items-start">
					<div className="flex gap-2">
						{tagMapperUtil.TNotificationIconMapper(data.icon)}
						<p className="text-xs">{formatDate(data.created_at)}</p>
					</div>
					<div className="">
						<p className="line-clamp-3">{data.content}</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default memo(NoticationCard);
