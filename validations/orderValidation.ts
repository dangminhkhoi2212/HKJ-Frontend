import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { TStatus } from "@/types";

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;
const orderSchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	orderDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	expectedDeliveryDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	actualDeliveryDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	specialRequests: yup.string().max(5000, "Tối đa 5000 kí tự"),
	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	customerRating: yup.number().required(REQUIRED_FIELD_MESSAGE),
	totalPrice: yup
		.number()
		.min(0, "Giá trị phải lớn hơn 0")
		.required(REQUIRED_FIELD_MESSAGE),
	budget: yup
		.number()
		.min(100000, "Giá trị phải lớn hơn 100,000 VND")
		.required(REQUIRED_FIELD_MESSAGE),
	project: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
	customer: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
	jewelry: yup.object({
		id: yup.number().nullable(),
	}),
	category: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
});

const orderValidation = {
	orderSchema,
};
export default orderValidation;
