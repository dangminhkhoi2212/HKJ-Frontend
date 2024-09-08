"use client";
import { routes } from "@/routes";
import { signOut } from "next-auth/react";
const useAccountButtonActions = () => {
  async function keycloakSessionLogOut() {
    try {
      await fetch(routes.signOut, { method: "GET" });
    } catch (err) {
      console.error(err);
    }
  }
  const signOutAll = async () => {
    await keycloakSessionLogOut().then(() =>
      signOut({ callbackUrl: routes.signIn })
    );
  };
  return { signOutAll };
};
export default useAccountButtonActions;
