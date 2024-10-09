import * as yup from 'yup';

import { KEY_CONST } from '@/const';

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;
const jewelrySchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	wieght: yup
		.number()
		.positive("Giá một đơn vị phải lớn hơn 0")
		.required(REQUIRED_FIELD_MESSAGE),
	color: yup.string().required(REQUIRED_FIELD_MESSAGE),
	active: yup.boolean().required(REQUIRED_FIELD_MESSAGE),
	isCustom: yup.boolean().required(REQUIRED_FIELD_MESSAGE),
	price: yup
		.number()
		.required(REQUIRED_FIELD_MESSAGE)
		.positive("Giá một đơn vị phải lớn hơn 0"),
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
		.object({ id: yup.number().min(1).required(REQUIRED_FIELD_MESSAGE) })
		.required(REQUIRED_FIELD_MESSAGE),
	project: yup.object({ id: yup.number().min(1).required(REQUIRED_FIELD_MESSAGE) }).required(REQUIRED_FIELD_MESSAGE), 
});
const jewelryValidation = {
	jewelrySchema,
};

export default jewelryValidation;
