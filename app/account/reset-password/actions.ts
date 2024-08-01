import { resetPassword } from "@/services/account.service";
import { TResetPassword } from "@/types/account.type";
import { App } from "antd";
import { useMutation } from "react-query";

const useResetPasswordActions = () => {
  const { modal } = App.useApp();

  const resetPasswordMutitation = useMutation({
    mutationFn: async (data: TResetPassword) => {
      console.log(data);

      return resetPassword(data.email);
    },
    onSuccess() {
      modal.success({
        content: "Vui lòng kiểm tra email của bạn để thay đổi mật khẩu",
      });
    },
    onError(error) {
      console.log(error);
      modal.error({
        content: "Đã có lỗi xảy ra vui lòng thử lại",
      });
    },
  });

  const onSubmit = (data: TResetPassword, reset: () => void) => {
    resetPasswordMutitation.mutate(data, {
      onSettled: () => {
        reset();
      },
    });
  };
  return { onSubmit, isLoading: resetPasswordMutitation.isLoading };
};

export default useResetPasswordActions;
