import dayjs from "dayjs";

import { getSupbaseInstance } from "@/config";
import { KEY_CONST } from "@/const";
import { TSchedule, TStatus } from "@/types";

const formatDateType = (time: string, type: "day" | "month" | "year") => {
	if (type == "month") return dayjs(time).format(KEY_CONST.DATE_FORMAT);
	if (type == "year") return dayjs(time).format("MM/YYYY");
	return dayjs(time).format(KEY_CONST.DATE_TIME_FORMAT);
};
class ScheduleService {
	private client;

	constructor() {
		this.client = getSupbaseInstance();
	}

	async getSchedule({
		textSearch = "",
		date,
		status_search = TStatus.IN_PROCESS,
	}: {
		textSearch?: string;
		date: string;
		status_search?: TStatus;
	}): Promise<TSchedule[]> {
		const reponse = await this.client.rpc("get_schedule_for_employee", {
			date,
			text_search: textSearch,
			status_search,
		});
		console.log("🚀 ~ ScheduleService ~ reponse:", reponse);
		const data = await reponse.data;
		return data;
	}
}
const scheduleService = new ScheduleService();

export default scheduleService;
