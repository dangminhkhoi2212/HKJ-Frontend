import * as yup from "yup";

import { KEY_CONST } from "@/const";

import shareValidation from "./shareValidation";

const { objectIdNotNullable } = shareValidation;
export const hireEmployeeSchema = yup.object({
	date: yup
		.object({
			startDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
			endDate: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
		})
		.required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	position: objectIdNotNullable(),
	employee: objectIdNotNullable(),

	beginSalary: yup
		.string()
		.required(KEY_CONST.REQUIRED_FIELD_MESSAGE)
		.min(4, "Tối thiểu 4 chữ số")
		.max(10, "Tối đa 10 chữ số"),

	notes: yup.string().max(300, "Tối đa 300 kí tự"),
});
