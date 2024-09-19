import { AUTHORIZATIONS } from "@/const/authorities";
import useAccountStore, { TAccountInfo } from "@/stores/account";
import useStyleStore from "@/stores/stype";
import { Divider, Layout, Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { MenuProps } from "antd/lib";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { menuAdmin, menuEmployee, menuManager, menuUser } from "./menus";
const { Sider } = Layout;

const renderMenu = (
  role: string | null | undefined
): ItemType<MenuItemType>[] | undefined => {
  switch (role) {
    case AUTHORIZATIONS.USER:
      return menuUser;
    case AUTHORIZATIONS.EMPLOYEE:
      return menuEmployee;
    case AUTHORIZATIONS.MANAGER:
      return menuManager;
    case AUTHORIZATIONS.ADMIN:
      return menuAdmin;
    default:
      return [];
  }
};
const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menus, setMenus] = useState<ItemType<MenuItemType>[] | undefined>([]);
  const account: TAccountInfo | null | undefined = useAccountStore(
    (state) => state.account
  );
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<
    React.Key | undefined
  >("");
  const [selectedKey, setSelectedKey] = useState<React.Key | undefined>(
    defaultSelectedKey
  );
  const collapsed: boolean = useStyleStore((state) => state.collapsed);
  const onClick: MenuProps["onClick"] = (e) => {
    const key: string = e.key;
    router.push(key);
  };
  useEffect(() => {
    // Determine which menu to display based on the current pathname
    const menuItems: ItemType[] | undefined | null = renderMenu(
      account?.authorities![0]
    );
    const defaultSelectedKey: React.Key | undefined =
      (menuItems?.length ?? 0) > 0 ? menuItems![0]?.key : "1";
    setMenus(menuItems || []);
    setDefaultSelectedKey(defaultSelectedKey);
  }, [account]);

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);
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
        selectedKeys={[pathname || "1"]}
        onClick={onClick}
        items={menus}
      />
    </Sider>
  );
};
export default Sidebar;
