import * as yup from "yup";

import { KEY_CONST } from "@/const";

const { REQUIRED_FIELD_MESSAGE } = KEY_CONST;

const materialSchema = yup.object({
  name: yup.string().required(REQUIRED_FIELD_MESSAGE),
  unit: yup.string().required(REQUIRED_FIELD_MESSAGE),
  supplier: yup.string().required(REQUIRED_FIELD_MESSAGE),
  coverImage: yup.string().required(REQUIRED_FIELD_MESSAGE),
  unitPrice: yup
    .number()
    .required(REQUIRED_FIELD_MESSAGE)
    .positive("Giá mỗi đơn vị phải lớn hơn 0")
    .min(1, "Giá mỗi đơn vị phải lớn hơn hoặc bằng 1"),
  quantity: yup
    .number()
    .required(REQUIRED_FIELD_MESSAGE)
    .positive("Số lượng phải lớn hơn 0")
    .integer("Số lượng phải là số nguyên")
    .min(1, "Tối thiểu 1 cái"),
  images: yup
    .array()
    .of(
      yup.object({
        url: yup
          .string()
          .url("URL không hợp lệ")
          .required(REQUIRED_FIELD_MESSAGE),
      })
    )
    .required(REQUIRED_FIELD_MESSAGE)
    .min(1, "Tối thiểu 1 hình")
    .max(5, "Tối đa 5 hình"),
});

const materialUpdateSchema = yup.object({
  id: yup.number().required(REQUIRED_FIELD_MESSAGE),
  name: yup.string().required(REQUIRED_FIELD_MESSAGE),
  unit: yup.string().required(REQUIRED_FIELD_MESSAGE),
  supplier: yup.string().required(REQUIRED_FIELD_MESSAGE),
  coverImage: yup.string().required(REQUIRED_FIELD_MESSAGE),
  unitPrice: yup
    .number()
    .required(REQUIRED_FIELD_MESSAGE)
    .positive("Giá mỗi đơn vị phải lớn hơn 0")
    .min(1, "Giá mỗi đơn vị phải lớn hơn hoặc bằng 1"),
  quantity: yup
    .number()
    .required(REQUIRED_FIELD_MESSAGE)
    .positive("Số lượng phải lớn hơn 0")
    .integer("Số lượng phải là số nguyên")
    .min(1, "Tối thiểu 1 cái"),
  images: yup
    .array()
    .of(
      yup.object({
        url: yup
          .string()
          .url("URL không hợp lệ")
          .required(REQUIRED_FIELD_MESSAGE),
      })
    )
    .required(REQUIRED_FIELD_MESSAGE)
    .min(1, "Tối thiểu 1 hình")
    .max(5, "Tối đa 5 hình"),
});

const materialValidation = {
  materialSchema,
  materialUpdateSchema,
};
export default materialValidation;
