import { useQuery } from "react-query";
import { getAccount } from "@/services/account.service";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import { App } from "antd";

export const useAccount = () => {
  const { setAccount, setIsLoading } = useAccountStore((state) => state);
  const { message } = App.useApp();
  return useQuery("account", getAccount, {
    onSuccess: (data) => {
      console.log("🚀 ~ useAccount ~ data:", data);
      const account = data as TAccountInfo;
      setIsLoading(false);
      setAccount(account);
    },
    onError: (error) => {
      console.log(error);

      message.error("Không thể lấy thông tin tài khoản người dùng");
    },
    enabled: false,
  });
};
