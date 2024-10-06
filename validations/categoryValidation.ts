import * as yup from "yup";

import { KEY_CONST } from "@/const";

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;
const categorySchema = yup
  .object({
    name: yup.string().required(REQUIRED_FIELD_MESSAGE),
  })
  .required(REQUIRED_FIELD_MESSAGE);
const categoryValidation = {
  categorySchema,
};
export default categoryValidation;
