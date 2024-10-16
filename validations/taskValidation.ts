import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { TStatus } from "@/types";
import { TPriority } from "@/types/priorityType";

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;
const createTaskSchema = yup.object({
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	description: yup.string(),
	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	priority: yup
		.mixed<TPriority>()
		.oneOf(Object.keys(TPriority) as TPriority[])
		.required(REQUIRED_FIELD_MESSAGE),
	date: yup.object({
		startDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
		endDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	}),
	employee: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
	project: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
});

const updateTaskSchema = yup.object({
	id: yup.number().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	description: yup.string(),
	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	priority: yup
		.mixed<TPriority>()
		.oneOf(Object.keys(TPriority) as TPriority[])
		.required(REQUIRED_FIELD_MESSAGE),
	date: yup.object({
		startDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
		endDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	}),
	employee: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
	project: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
});
const taskValidation = {
	createTaskSchema,
	updateTaskSchema,
};
export default taskValidation;
