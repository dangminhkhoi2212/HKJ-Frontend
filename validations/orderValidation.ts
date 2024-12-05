import * as yup from "yup";

import { KEY_CONST } from "@/const";
import { TStatus } from "@/types";

import orderItemValidation from "./orderItemValidation";
import shareValidation from "./shareValidation";

const { objectIdNotNullable, objectIdNullable, priceValidation, idNullable } =
	shareValidation;
const { REQUIRED_FIELD_MESSAGE, REQUIRED_NUMBER_FIELD } = KEY_CONST;
const orderSchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	orderDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	expectedDeliveryDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
	actualDeliveryDate: yup.string().nullable(),

	status: yup
		.mixed<TStatus>()
		.oneOf(Object.values(TStatus) as TStatus[])
		.required(REQUIRED_FIELD_MESSAGE),
	totalPrice: priceValidation(),

	customer: yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.required(REQUIRED_FIELD_MESSAGE),
	}),
	orderItems: yup
		.array(orderItemValidation.orderItemSchema)
		.required(REQUIRED_FIELD_MESSAGE),
	project: objectIdNullable("project"),
});

const orderValidation = {
	orderSchema,
};
export default orderValidation;
