import * as yup from "yup";

import { KEY_CONST } from "@/const";

const templateSchema = yup.object({
	id: yup.number().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	name: yup.string().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	category: yup.object({
		id: yup.number().required(KEY_CONST.REQUIRED_FIELD_MESSAGE),
	}),
});

const templateValidation = {
	templateSchema,
};
export default templateValidation;
