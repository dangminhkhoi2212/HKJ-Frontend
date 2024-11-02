import * as yup from 'yup';

import { KEY_CONST } from '@/const';

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;

const materialSchema = yup.object({
	id: yup.number().required(REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(REQUIRED_FIELD_MESSAGE),
	coverImage: yup
		.array()
		.required(REQUIRED_FIELD_MESSAGE)
		.min(1, "Tối thiểu 1 hình")
		.max(1, "Tối đa 1 hình"),
});

const materialValidation = {
	materialSchema,
};
export default materialValidation;
