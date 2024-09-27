"use client";
import { useEffect } from "react";

import { useRouterCustom } from "@/hooks";
import { routesAdmin } from "@/routes";

const AdminPage = () => {
  const { router, pathname } = useRouterCustom();
  useEffect(() => {
    if (pathname === "/admin") {
      router.push(routesAdmin.accounts);
    }
  }, []);
  return <></>;
};

export default AdminPage;
