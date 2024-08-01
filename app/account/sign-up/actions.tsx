import { signUp } from "@/services/account.service";
import { UseFormReset } from "react-hook-form";
import { useMutation } from "react-query";
import { App } from "antd";
import { TSignUp, TSignUpForm } from "@/types/account.type";

const useSignUpActions = () => {
  const { message, modal } = App.useApp();

  const signUpMutation = useMutation({
    mutationFn: async (data: TSignUp) => {
      await signUp(data);
    },
    onSuccess: (data, variables, context) => {
      showModal();
    },
    onError: (error) => {
      message.error("Đã có lỗi xảy ra khi đăng ký");
    },
  });

  const onSubmit = (data: TSignUp, reset: () => void) => {
    signUpMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const showModal = () => {
    modal.warning({
      title: "Đăng ký thành công",
      content: "Vui lòng kiểm tra email của bạn để xác thực tài khoản",
    });
  };

  return {
    onSubmit,
  };
};

export default useSignUpActions;
