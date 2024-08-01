type TPassword = {
  password: string;
};
type TConfirmPassword = {
  confirmPassword: string;
};
export type TSignIn = {
  username: string;
} & TPassword;
export type TSignUp = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  login: string;
} & TConfirmPassword;
export type TSignUpForm = TSignUp & TConfirmPassword;
export type TResetPassword = {
  email: string;
};

export type TResetPasswordForm = TPassword & TConfirmPassword;
export type TResetPasswordFormApi = {
  key: string;
  newPassword: string;
};
