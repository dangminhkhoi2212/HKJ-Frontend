"use client";

import { App } from "antd";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";

import Loading from "@/app/loading";
import { routes } from "@/routes";
import { getAccount } from "@/services/accountService";
import useAccountStore from "@/stores/account";
import { useQuery } from "@tanstack/react-query";

import LoadingIntro from "../Loading/LoadingIntro";

const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { message } = App.useApp();
	const { account, setAccount } = useAccountStore();
	const { data: session, status } = useSession();

	const {
		data: accountData,
		error: accountError,
		isLoading,
	} = useQuery({
		queryKey: ["account"],
		queryFn: getAccount,
		enabled:
			!!session?.access_token && !account && pathname !== routes.signIn,
		retry: 3,
	});

	useEffect(() => {
		if (accountData) {
			setAccount(accountData);
		}
	}, [accountData, setAccount]);

	useEffect(() => {
		if (accountError) {
			console.error("Failed to fetch account:", accountError);
			message.error("Không thể lấy thông tin tài khoản người dùng");
			if (pathname !== routes.signIn) {
				router.push(routes.signIn);
			}
		}
	}, [accountError, message, pathname, router]);

	useEffect(() => {
		if (session?.error === "RefreshAccessTokenError") {
			signOut({ callbackUrl: routes.signIn });
		}
	}, [session]);

	if (isLoading || (!account && pathname !== routes.signIn)) {
		return <LoadingIntro />;
	}

	return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Security;
