"use client";
import { routes } from "@/routes";
import { signOut } from "next-auth/react";
const useAccountButtonActions = () => {
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
      console.log("🚀 ~ signOutAll ~ ok");
    } catch (error) {
      console.log("🚀 ~ signOutAll ~ error:", error);
    }
  };
  return { signOutAll };
};
export default useAccountButtonActions;
