import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { TStatus } from "@/types";

const { REQUIRED_FIELD_MESSAGE, REQUIRED_NUMBER_FIELD } = KEY_CONST;
const orderSchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	orderDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	expectedDeliveryDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	actualDeliveryDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	specialRequests: yup
		.string()
		.max(5000, "Tối đa 5000 kí tự")
		.required(REQUIRED_FIELD_MESSAGE),
	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	customerRating: yup.number().required(REQUIRED_FIELD_MESSAGE),
	totalPrice: yup
		.number()
		.typeError(REQUIRED_NUMBER_FIELD)
		.min(0, REQUIRED_NUMBER_FIELD)
		.positive(REQUIRED_NUMBER_FIELD)
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
	material: yup.object({
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
