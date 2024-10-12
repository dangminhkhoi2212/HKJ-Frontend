import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { TStatus } from "@/types";
import { TPriority } from "@/types/priorityType";

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;
const projectSchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	coverImage: yup.string().required(REQUIRED_FIELD_MESSAGE),
	description: yup.string(),
	date: yup
		.object({
			startDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
			endDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
		})
		.required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	expectDate: yup.string().required("Expected date is required"),
	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	priority: yup
		.mixed<TPriority>()
		.oneOf(Object.keys(TPriority) as TPriority[])
		.required(REQUIRED_FIELD_MESSAGE),
	budget: yup
		.number()
		.required(REQUIRED_FIELD_MESSAGE)
		.min(0, "Kinh phí phải lớn hơn 0"),
	actualCost: yup.number(),
	qualityCheck: yup.boolean().required(REQUIRED_FIELD_MESSAGE),
	notes: yup.string(),
	category: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
		name: yup.string(),
	}),
	jewelry: yup.object({
		id: yup.number().nullable(),
		name: yup.string(),
		coverImage: yup.string(),
	}),
});
const projectValidation = { projectSchema };
export default projectValidation;
