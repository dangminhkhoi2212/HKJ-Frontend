"use client";

import { App } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useAccountStore } from "@/providers";
import { routes } from "@/routes";
import { getAccount } from "@/services/accountService";
import { TAccountInfo } from "@/types";

import LoadingIntro from "../Loading/LoadingIntro";

const Security: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const { message } = App.useApp();
	const setAccount = useAccountStore((state) => state.setAccount);
	const account = useAccountStore((state) => state.account);
	const { data: session, status } = useSession();
	console.log("🚀 session~ status:", status);

	// useEffect(() => {
	// 	let storedAccount = null;
	// 	// Fetch the account from localStorage on the client side
	// 	if (typeof window !== "undefined") {
	// 		storedAccount = localStorage.getItem("account");
	// 	}

	// 	const getAccountData = async () => {
	// 		try {
	// 			const accountData: TAccountInfo = await getAccount();
	// 			localStorage.setItem("account", JSON.stringify(accountData));
	// 			setAccount(accountData);
	// 		} catch (error) {
	// 			console.log("🚀 ~ getAccountData ~ error:", error);
	// 			// message.error("Đăng nhập thất bại");
	// 			router.push(routes.signIn);
	// 		}
	// 	};

	// 	if (status === "unauthenticated") {
	// 		router.push(routes.signIn);
	// 	} else if (session?.error === "RefreshAccessTokenError") {
	// 		signOut({ callbackUrl: routes.signIn });
	// 	} else if (!storedAccount && status === "authenticated") {
	// 		getAccountData();
	// 	} else if (storedAccount && status === "authenticated") {
	// 		setAccount(JSON.parse(storedAccount));
	// 	}
	// }, [session, status, message, router]);

	const getAccountData = async () => {
		try {
			const accountData: TAccountInfo = await getAccount();
			// localStorage.setItem("account", JSON.stringify(accountData));
			setAccount(accountData);
		} catch (error) {
			console.log("🚀 ~ getAccountData ~ error:", error);
			// message.error("Đăng nhập thất bại");
			router.push(routes.signIn);
		}
	};

	useEffect(() => {
		if (status === "authenticated" && !account) {
			getAccountData();
		}
		if (status === "unauthenticated") {
			router.push(routes.signIn);
		}
		return () => {
			// Optional: Add a destructor function here if needed
		};
	}, [status, getAccountData, account, router]);

	if (status === "loading") {
		return <LoadingIntro />;
	}

	return <>{children}</>;
};

export default Security;
