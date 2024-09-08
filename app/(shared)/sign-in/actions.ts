"use client";
import routes from "@/routes";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { signIn } from "@/services/account.service";
import { useAccount } from "@/hooks/account";
import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY } from "@/config/key";
import { useEffect, useState } from "react";
import { TSignIn } from "@/types/account.type";
import { App } from "antd";
const useSignInActions = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch: getAccount, isLoading: isLoadingGetAccount } = useAccount();

  const onSubmit: SubmitHandler<TSignIn> = (data) =>
    signInMutation.mutate(data);

  const setToken = (token: string) => {
    Cookies.set(AUTH_TOKEN_KEY, token);
  };
  const signInMutation = useMutation({
    mutationFn: (data: TSignIn) => {
      return signIn(data);
    },
    onSuccess: async (data: any) => {
      setToken(data.id_token);
      // get and set an account info to store
      await getAccount();
      message.success("Đặng nhập thành công");
      router.push(routes.home);
    },

    onError: (error) => {
      message.error("Có lỗi khi đăng nhập");
    },
  });

  useEffect(() => {
    setIsLoading(signInMutation.isLoading || isLoadingGetAccount);
  }, [signInMutation.isLoading, isLoadingGetAccount, setIsLoading]);

  return {
    onSubmit,
    signInMutation,
    isLoading,
  };
};
export default useSignInActions;
