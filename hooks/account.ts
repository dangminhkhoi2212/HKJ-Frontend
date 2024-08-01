import { useQuery } from "react-query";
import { getAccount } from "@/services/account.service";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import { App } from "antd";

export const useAccount = () => {
  const setAccount = useAccountStore((state) => state.setAccount);
  const { message } = App.useApp();
  return useQuery("account", getAccount, {
    onSuccess: (data) => {
      const account = data as TAccountInfo;
      setAccount(account);
    },
    onError: (error) => {
      message.error("Không thể lấy thông tin tài khoản người dùng");
    },
    enabled: false,
  });
};
