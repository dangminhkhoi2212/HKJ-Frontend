import dayjs from "dayjs";
import React, { memo, useMemo } from "react";

import { TGanttTaskCustom } from "@/types";
import { formatUtil, tagMapperUtil } from "@/utils";

type Props = { task: TGanttTaskCustom };
const { TStatusColorMapper } = tagMapperUtil;
const { formatDate } = formatUtil;
const GantTaskModelCustom: React.FC<Props> = ({ task }) => {
	const duration = useMemo(() => {
		const start = dayjs(task.start);
		const end = dayjs(task.end);
		const duration = end.diff(start, "days") + 1;
		return duration;
	}, [task]);
	return (
		<div className="m-0 p-3 shadow-lg rounded-lg bg-white text-xs flex flex-col gap-1">
			<p className="font-semibold ">{task.name}</p>
			<p>
				Thời gian:{" "}
				{formatDate(task.start.toISOString(), { removeTime: true })} -{" "}
				{formatDate(task.end.toISOString(), { removeTime: true })}
			</p>
			<p>Thời hạn: {duration} ngày.</p>
			<p>Trạng thái: {TStatusColorMapper(task?.more?.status!)}</p>
		</div>
	);
};

export default memo(GantTaskModelCustom);
