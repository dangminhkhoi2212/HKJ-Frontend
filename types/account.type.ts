type TPassword = {
  password: string;
};
type TConfirmPassword = {
  confirmPassword: string;
};
export type TSignIn = {
  username: string;
} & TPassword;
export type TFirstName = {
  firstName: string;
};
export type TLastName = {
  lastName: string;
};
export type TEmail = {
  email: string;
};
export type TPhone = {
  phone: string;
};

export type TFormBasic = { id: string } & TFirstName & TLastName & TPhone;
export type TFormEmail = TEmail;
export type TFormPassword = TPassword & TConfirmPassword;
