import dayjs from "dayjs";

import { getSupbaseInstance } from "@/config";
import { KEY_CONST } from "@/const";
import { TJewelry } from "@/types";

interface StorageConfig {
	bucket: string;
	defaultContentType: string;
}
interface RevenueData {
	time: string;
	value: number;
}
type TQuantity = Record<string, number>;
const formatDateType = (time: string, type: "day" | "month" | "year") => {
	if (type == "month") return dayjs(time).format(KEY_CONST.DATE_FORMAT);
	if (type == "year") return dayjs(time).format("MM/YYYY");
	return dayjs(time).format(KEY_CONST.DATE_TIME_FORMAT);
};
class StatisticService {
	private client;

	constructor() {
		this.client = getSupbaseInstance();
	}
	async getOrderQuantityByTime(
		input: string,
		type: "day" | "month" | "year"
	): Promise<RevenueData[]> {
		const timeFormats = {
			day: "to_char(order_date, 'YYYY-MM-DD HH24')", // Theo giờ nếu input là ngày
			month: "to_char(order_date, 'YYYY-MM-DD')", // Theo ngày nếu input là tháng
			year: "to_char(order_date, 'YYYY-MM')", // Theo tháng nếu input là năm
		};

		let startDate = dayjs(input).hour(0).toISOString();
		console.log("🚀 ~ StatisticService ~ startDate:", startDate);
		let endDate: string;

		// Xác định khoảng thời gian cần truy vấn
		if (type === "day") {
			// Nếu input là ngày
			endDate = dayjs(input).hour(23).toISOString();
		} else if (type === "month") {
			// Nếu input là tháng
			startDate = dayjs(input).date(1).toISOString();
			endDate = dayjs(input).date(31).toISOString();
		} else {
			startDate = dayjs(input).date(1).month(0).toISOString();
			endDate = dayjs(input).date(31).month(11).toISOString();
		}
		console.log("🚀 ~ StatisticService ~ endDate:", endDate);

		// Truy vấn Supabase
		const { data, error } = await this.client
			.from("hkj_order")
			.select("order_date") // Only select `order_date`
			.eq("is_deleted", false) // Exclude deleted orders
			.gte("order_date", startDate) // Filter by start date
			.lt("order_date", endDate); // Filter by end date

		if (error) throw error;
		const quantity = data?.reduce((acc: Record<string, number>, order) => {
			const timeKey = formatDateType(order.order_date, type); // Format based on granularity
			acc[timeKey] = (acc[timeKey] || 0) + 1; // Increment order count
			return acc;
		}, {});

		// Transform grouped data into the required format
		const revenueArray: RevenueData[] = Object.entries(quantity || {}).map(
			([time, value]) => ({
				time,
				value,
			})
		);

		return revenueArray;
	}
	async getRevenueByGranularity(
		input: string,
		type: "day" | "month" | "year"
	): Promise<RevenueData[]> {
		const timeFormats = {
			day: "to_char(order_date, 'YYYY-MM-DD HH24')", // Theo giờ nếu input là ngày
			month: "to_char(order_date, 'YYYY-MM-DD')", // Theo ngày nếu input là tháng
			year: "to_char(order_date, 'YYYY-MM')", // Theo tháng nếu input là năm
		};

		let startDate = dayjs(input).hour(0).toISOString();
		console.log("🚀 ~ StatisticService ~ startDate:", startDate);
		let endDate: string;

		// Xác định khoảng thời gian cần truy vấn
		if (type === "day") {
			// Nếu input là ngày
			endDate = dayjs(input).hour(23).toISOString();
		} else if (type === "month") {
			// Nếu input là tháng
			startDate = dayjs(input).date(1).toISOString();
			endDate = dayjs(input).date(31).toISOString();
		} else {
			startDate = dayjs(input).date(1).month(0).toISOString();
			endDate = dayjs(input).date(31).month(11).toISOString();
		}
		console.log("🚀 ~ StatisticService ~ endDate:", endDate);

		// Truy vấn Supabase
		const { data, error } = await this.client
			.from("hkj_order")
			.select(`order_date, total_price`)
			.eq("is_deleted", false) // Chỉ lấy đơn hàng chưa bị xóa
			// .eq("status", TStatus.DELIVERED)
			.gte("order_date", startDate)
			.lt("order_date", endDate); // Chỉ lấy dữ liệu trong khoảng thời gian
		console.log("🚀 ~ StatisticService ~ data:", data);
		console.log("🚀 ~ StatisticService ~ error:", error);

		if (error) throw error;

		// Gom nhóm và tính tổng doanh thu
		const revenue = data?.reduce((acc: any, order) => {
			const timeKey = formatDateType(order.order_date, type);
			acc[timeKey] = (acc[timeKey] || 0) + Number(order.total_price);
			return acc;
		}, {});
		const revenueArray: RevenueData[] = Object.entries(revenue)?.map(
			([time, value]) => ({
				time,
				value: value as number,
			})
		);
		return revenueArray;
	}
	async getQuantity(): Promise<TQuantity> {
		const results: TQuantity = {};
		const { count: countProduct } = await this.client
			.from("hkj_jewelry_model")
			.select("*", { count: "exact", head: true });
		results["product"] = countProduct || 0;

		const { count: countOrder } = await this.client
			.from("hkj_order")
			.select("*", { count: "exact", head: true });
		results["order"] = countOrder || 0;

		const { count: countAccount } = await this.client
			.from("user_extra")
			.select("*", { count: "exact", head: true });
		results["account"] = countAccount || 0;
		const { data, error } = await this.client
			.from("hkj_order")
			.select("total_price");

		if (error) {
			throw error;
		}

		// Safely retrieve the sum
		const total = data?.reduce(
			(total, order) => total + order.total_price,
			0
		);

		results["revenue"] = total || 0;

		return results;
	}
	async getTopProductOrder(limit: number = 5): Promise<TJewelry[]> {
		const reponse = await this.client.rpc("get_product_trending", {
			limit_count: limit,
		});
		const data = reponse.data;
		const dataConvert = data?.map((item: any) => {
			return {
				id: item.id,
				name: item.name,
				coverImage: item["cover_image"],
				price: item.price,
			};
		});

		return dataConvert;
	}
}
const statisticService = new StatisticService();

export default statisticService;
