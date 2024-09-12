import React, { useEffect, useState } from "react";
import { Divider, Layout, Menu } from "antd";
import Logo from "../Logo";
import TrackProductCard from "@/shared/Sidebar/TrackProductCard";
import useStyleStore from "@/stores/stype";
import { menuUser, menuEmployee, menuManager } from "./menus";
import { useSession } from "next-auth/react";
import { AUTHORIZATIONS, ROLE_PREFIXES } from "@/const/authorities";
import { usePathname, useRouter } from "next/navigation";
import { MenuProps } from "antd/lib";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
const { Sider } = Layout;

const renderMenu = (role: string): ItemType[] | undefined => {
  switch (role) {
    case AUTHORIZATIONS.USER:
      return menuUser;
    case AUTHORIZATIONS.EMPLOYEE:
      return menuEmployee;
    case AUTHORIZATIONS.MANAGER:
      return menuManager;
    default:
      return [];
  }
};
const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menus, setMenus] = useState<ItemType<MenuItemType>[] | undefined>([]);
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<
    React.Key | undefined
  >("");
  const { data: session } = useSession();
  const collapsed: boolean = useStyleStore((state) => state.collapsed);
  const onClick: MenuProps["onClick"] = (e) => {
    const key: string = e.key;
    router.push(key);
  };
  useEffect(() => {
    // Determine which menu to display based on the current pathname
    const menuItems: ItemType[] | undefined = renderMenu(session?.user.role!);
    const defaultSelectedKey: React.Key | undefined =
      (menuItems?.length ?? 0) > 0 ? menuItems![0]?.key : "1";
    setMenus(menuItems);
    setDefaultSelectedKey(defaultSelectedKey);
  }, [session?.user.role, pathname]);
  // Determine the default selected key by getting the key of the first item in the menu
  return (
    <Sider trigger={null} collapsible theme="light" collapsed={collapsed}>
      <div className="flex justify-center items-center h-[64px]">
        <Logo />
      </div>
      <Divider />
      <Menu
        theme="light"
        mode="inline"
        className=""
        defaultSelectedKeys={[defaultSelectedKey?.toString() || "1"]}
        onClick={onClick}
        items={menus}
      />
      <Divider />
      <TrackProductCard />
    </Sider>
  );
};
export default Sidebar;
