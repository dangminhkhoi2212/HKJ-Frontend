import { default as dayjs } from "dayjs";

import { KEY_CONST } from "@/const";

const formatDate = (
	date: number | string,
	{
		removeDate,
		removeTime,
	}: { removeDate?: boolean; removeTime?: boolean } = {}
) => {
	const dayjsDate = dayjs(date);
	if (!dayjsDate.isValid()) {
		return "Không tìm thấy";
	}
	let stringFormat = KEY_CONST.DATE_TIME_FORMAT;
	if (removeDate) {
		stringFormat = KEY_CONST.TIME_FORMAT;
	}
	if (removeTime) {
		stringFormat = KEY_CONST.DATE_FORMAT;
	}

	return dayjs(date).format(stringFormat);
};
const formatCurrency = (value: number | string) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		currencyDisplay: "code",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(Number(value));
};

const objectToParams = (obj: Record<string, any>): string => {
	if (
		!obj ||
		typeof obj !== "object" ||
		Array.isArray(obj) ||
		!Object.keys(obj).length
	)
		return "";

	const paramsArray: string[] = Object.entries(obj).map(([key, value]) => {
		if (typeof value === "object") {
			value = objectToParams(value);
			return `${key}.${value}`;
		}
		return `${key}=${value}`;
	});
	console.log(
		"🚀 ~ constparamsArray:string[]=Object.entries ~ paramsArray:",
		paramsArray
	);
	return paramsArray.join("&");
};

const objectOneDegree = (obj: Record<string, any>) => {
	if (
		!obj ||
		typeof obj !== "object" ||
		Array.isArray(obj) ||
		!Object.keys(obj).length
	)
		return obj;

	const newObject: Record<string, any> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "object") {
			for (const [valueKey, valueValue] of Object.entries(value)) {
				newObject[`${key}.${valueKey}`] = valueValue;
			}
		} else newObject[key] = value;
	}
	return newObject;
};
const formatUtil = {
	formatDate,
	formatCurrency,
	objectToParams,
	objectOneDegree,
};
export default formatUtil;
