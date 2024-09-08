import { updateAccountBasic } from "@/services/account.service";
import useAccountStore from "@/stores/account";
import { TFormBasic } from "@/types/account.type";
import { App } from "antd";
import { useMutation } from "react-query";

const useProfileActions = () => {
  const { message } = App.useApp();

  const formBasicMutation = useMutation({
    mutationFn: (data: TFormBasic) => updateAccountBasic(data),
    onSuccess: () => {
      message.success("Account updated successfully");
    },
    onError: (error: any) => {
      message.error("Failed to update account");
    },
  });

  const formBasicActions = (data: TFormBasic) => {
    formBasicMutation.mutate(data);
  };

  return {
    formBasicActions,
    isLoadingFormBasic: formBasicMutation.isLoading,
  };
};

export default useProfileActions;
