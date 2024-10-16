"use client";
import { App } from "antd";
import { signOut } from "next-auth/react";

import { routes } from "@/routes";
import useAccountStore from "@/stores/account";

import { useRouterCustom } from "./router";

export const useAccount = () => {
	const { setAccount, setIsLoading } = useAccountStore((state) => state);
	const { message } = App.useApp();
	const { router } = useRouterCustom();

	async function keycloakSessionLogOut() {
		try {
			const res = await fetch(routes.signOut, { method: "GET" });
			console.log("🚀 ~ keycloakSessionLogOut ~ res:", res);
		} catch (err) {
			console.log("🚀 ~ keycloakSessionLogOut ~ err:", err);
		}
	}
	const signOutAll = async () => {
		try {
			await keycloakSessionLogOut();
			await signOut({ callbackUrl: routes.signIn });

			await signOut({
				callbackUrl: routes.signIn,
			});
			console.log("🚀 ~ signOutAll ~ SIGN OUT");
		} catch (error) {
			console.log("🚀 ~ signOutAll ~ error:", error);
		}
	};
	return { signOutAll };
};
