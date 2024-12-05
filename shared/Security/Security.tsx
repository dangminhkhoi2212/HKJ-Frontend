"use client";

import { App } from "antd";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

import { KEY_CONST } from "@/const";
import { useAccountStore } from "@/providers";
import { routes } from "@/routes";
import { getAccount } from "@/services/accountService";
import { TAccountInfo } from "@/types";

import LoadingIntro from "../Loading/LoadingIntro";

const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { message } = App.useApp();
	const setAccount = useAccountStore((state) => state.setAccount);
	const account = useAccountStore((state) => state.account);
	const { data: session, status } = useSession();

	const getAccountData = useCallback(async () => {
		try {
			const accountData: TAccountInfo = await getAccount();
			Cookies.set(
				KEY_CONST.ACCOUNT_ID_COOKIE,
				JSON.stringify(accountData.id)
			);
			setAccount(accountData);
		} catch (error) {
			console.error("Failed to fetch account data:", error);
			message.error("Đăng nhập thất bại. Vui lòng thử lại.");
		}
	}, [setAccount, message, router]);

	useEffect(() => {
		if (pathname === routes.signIn) return;
		if (status === "authenticated" && !account?.id) {
			getAccountData();
		} else if (status === "unauthenticated") {
			router.push(routes.signIn);
		} else if (session?.error === "RefreshAccessTokenError") {
			signOut({ callbackUrl: routes.signIn });
		}
	}, [status, account?.id, getAccountData, router, session, pathname]);

	if (!account && pathname !== routes.signIn) return <LoadingIntro />;

	return <>{children}</>;
};

export default Security;
