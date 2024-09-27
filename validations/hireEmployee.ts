import { REQUIRED_FIELD_MESSAGE } from "@/const/key";
import * as yup from "yup";
export const hireEmployeeSchema = yup.object({
  date: yup
    .object({
      startDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
      endDate: yup.string().required(REQUIRED_FIELD_MESSAGE),
    })
    .required(REQUIRED_FIELD_MESSAGE),
  position: yup.string().required(REQUIRED_FIELD_MESSAGE),

  beginSalary: yup.string().required(REQUIRED_FIELD_MESSAGE),
  employee: yup.string().required(REQUIRED_FIELD_MESSAGE),
  notes: yup.string().max(300, "Tối đa 300 kí tự"),
});
