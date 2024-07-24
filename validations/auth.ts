import * as yup from "yup";

export const EMAIL_MAX_LENGTH = 254;
export const PHONE_LENGTH = 10;
export const USERNAME_MIN_LENGTH = 1;
export const USERNAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 6;
export const FIRSTNAME_MIN_LENGTH = 1;
export const FIRSTNAME_MAX_LENGTH = 25;
export const LASTNAME_MIN_LENGTH = 1;
export const LASTNAME_MAX_LENGTH = 10;
// =============================================================================
const username = yup
  .string()
  .required("Tên đăng nhập được yêu cầu")
  .min(USERNAME_MIN_LENGTH, "Phải có ít nhất một kí tự")
  .max(USERNAME_MAX_LENGTH, "Tối đa là 50 kí tự");
const email = yup
  .string()
  .email("Email không đúng định dạnh")
  .max(EMAIL_MAX_LENGTH, "Email tối đa là 254 kí tự")
  .required("Email được yêu cầu");
const phone = yup
  .string()
  .matches(/^[0-9]{10}$/, "Số điện thoại phải là 10 số")
  .required("Số điện thoại được yêu cầu");
const firstName = yup
  .string()
  .required("Họ được yêu cầu")
  .min(FIRSTNAME_MIN_LENGTH, "Họ tối thiếu là 1 kí tự")
  .max(FIRSTNAME_MAX_LENGTH, "Họ tối đa là 25 kí tự");
const lastName = yup
  .string()
  .required("Tên được yêu cầu")
  .min(LASTNAME_MIN_LENGTH, "Tên tối thiếu là 1 kí tự")
  .max(LASTNAME_MAX_LENGTH, "Tên tối đa là 10 kí tự");
const password = yup
  .string()
  .min(PASSWORD_MIN_LENGTH, "Mật khẩu phải ít nhất 6 kí tự")
  .required("Mật khẩu được yêu cầu");
const confirmPassword = yup
  .string()
  .oneOf([yup.ref("password")], "Passwords must match")
  .required("Xác nhận mật khẩu được yêu cầu");

// =============================================================================
export const signInSchema = yup
  .object({
    username,
    password,
  })
  .required();

export const signUpSchema = yup
  .object({
    firstName,
    lastName,
    username,
    email,
    phone,
    password,
    confirmPassword,
  })
  .required();

export const resetPasswordSchema = yup
  .object({
    email,
  })
  .required();
