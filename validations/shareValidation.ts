import * as yup from "yup";

import { KEY_CONST } from "@/const";

const { REQUIRED_FIELD_MESSAGE, REQUIRED_NUMBER_FIELD } = KEY_CONST;

const idNullable = yup
	.mixed()
	.nullable()
	.test("is-new", REQUIRED_FIELD_MESSAGE, (value) => {
		// Nếu id khác null thì luôn pass (bỏ qua validation)
		if (value !== null) {
			return true;
		}
		if (typeof value !== "number") return false;
		// Nếu id là null thì phải validate điều kiện
		return value > 0;
	});
const objectIdNullable = (field: string) =>
	yup
		.object({
			id: yup.number().when(field, (project, schema) => {
				if (project) {
					return schema.min(1, REQUIRED_FIELD_MESSAGE).required();
				}
				return schema;
			}),
		})
		.default(null)
		.nullable();
const objectIdNotNullable = () =>
	yup.object({
		id: yup
			.number()
			.min(1, REQUIRED_FIELD_MESSAGE)
			.typeError(REQUIRED_NUMBER_FIELD)
			.required(REQUIRED_FIELD_MESSAGE),
	});

const priceValidation = () =>
	yup
		.number()
		.nullable() // Cho phép null
		.default(null) // Giá trị mặc định là null
		.test("is-positive", REQUIRED_NUMBER_FIELD, (value) => {
			// Nếu giá trị không phải là null, kiểm tra điều kiện
			if (value !== null) {
				return value > 0; // Giá trị phải lớn hơn 0
			}
			return true; // Nếu là null, không cần kiểm tra
		});

const shareValidation = {
	objectIdNullable,
	objectIdNotNullable,
	priceValidation,
	idNullable,
};
export default shareValidation;
