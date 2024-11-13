import * as yup from "yup";

import { KEY_CONST } from "@/const";

import shareValidation from "./shareValidation";

const { objectIdNotNullable, objectIdNullable, priceValidation, idNullable } =
	shareValidation;
const { REQUIRED_FIELD_MESSAGE, REQUIRED_NUMBER_FIELD } = KEY_CONST;
const orderItemSchema = yup.object({
	id: idNullable,
	quantity: yup
		.number()
		.min(1, REQUIRED_FIELD_MESSAGE)
		.required(REQUIRED_FIELD_MESSAGE),
	specialRequests: yup.string().max(5000, "Tối đa 5000 kí tự"),
	notes: yup.string().max(5000, "Tối đa 5000 kí tự"),
	price: priceValidation(),
	project: objectIdNullable("project"),

	jewelry: objectIdNullable("jewelry"),
	material: objectIdNullable("material"),
	category: objectIdNullable("category"),
	images: yup.array(),
});

const orderItemValidation = {
	orderItemSchema,
};
export default orderItemValidation;
