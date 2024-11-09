import * as yup from "yup";

import { KEY_CONST } from "@/const";

const { REQUIRED_FIELD_MESSAGE, REQUIRED_NUMBER_FIELD } = KEY_CONST;

const material = yup.object({
	id: yup
		.number()
		.min(1, REQUIRED_NUMBER_FIELD)
		.required(REQUIRED_FIELD_MESSAGE),
	unit: yup.string().required(REQUIRED_FIELD_MESSAGE),
	pricePerUnit: yup
		.number()
		.typeError(REQUIRED_NUMBER_FIELD)
		.min(0, REQUIRED_NUMBER_FIELD)
		.positive(REQUIRED_NUMBER_FIELD)
		.required(REQUIRED_FIELD_MESSAGE),
});
const jewelrySchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	sku: yup.string().required(REQUIRED_FIELD_MESSAGE),

	active: yup.boolean().required(REQUIRED_FIELD_MESSAGE),
	price: yup
		.number()
		.typeError(REQUIRED_NUMBER_FIELD)
		.min(0, REQUIRED_NUMBER_FIELD)
		.positive(REQUIRED_NUMBER_FIELD)
		.required(REQUIRED_FIELD_MESSAGE),
	coverImage: yup
		.array()
		.required(REQUIRED_FIELD_MESSAGE)
		.min(1, "Tối thiểu 1 hình")
		.max(1, "Tối đa 1 hình"),
	images: yup
		.array()
		.required(REQUIRED_FIELD_MESSAGE)
		.min(1, "Tối thiểu 1 hình")
		.max(15, "Tối đa 15 hình"),
	description: yup.string().max(3000, "Tối đa 3000 kí tự"),
	category: yup
		.object({
			id: yup
				.number()
				.min(1, REQUIRED_FIELD_MESSAGE)
				.required(REQUIRED_FIELD_MESSAGE),
		})
		.required(REQUIRED_FIELD_MESSAGE),
	manager: yup
		.object({
			id: yup
				.number()
				.min(1, REQUIRED_FIELD_MESSAGE)
				.required(REQUIRED_FIELD_MESSAGE),
		})
		.required(REQUIRED_FIELD_MESSAGE),
	materials: yup
		.array(
			yup.object({
				id: yup.number().nullable(),
				material: material,

				price: yup
					.number()
					.typeError(REQUIRED_NUMBER_FIELD)
					.min(0, REQUIRED_NUMBER_FIELD)
					.positive(REQUIRED_NUMBER_FIELD)
					.required(REQUIRED_FIELD_MESSAGE),
				usage: yup
					.number()
					.typeError(REQUIRED_NUMBER_FIELD)
					.min(0, REQUIRED_NUMBER_FIELD)
					.positive(REQUIRED_NUMBER_FIELD)
					.required(REQUIRED_FIELD_MESSAGE),
			})
		)

		.required(REQUIRED_FIELD_MESSAGE),
	project: yup
		.object({
			id: yup
				.number()
				.min(1, REQUIRED_FIELD_MESSAGE)
				.required(REQUIRED_FIELD_MESSAGE),
		})
		.required(REQUIRED_FIELD_MESSAGE),
});
const jewelryValidation = {
	jewelrySchema,
};

export default jewelryValidation;
