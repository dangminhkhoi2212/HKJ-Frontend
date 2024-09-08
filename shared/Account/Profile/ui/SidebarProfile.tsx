import { Anchor } from "antd";
import React from "react";

const SidebarProfile = () => {
  const menus = [
    {
      key: React.useId(),
      href: "#basic",
      title: "Basic",
    },
    {
      key: React.useId(),
      href: "#email",
      title: "Email",
    },
    {
      key: React.useId(),
      href: "#phone",
      title: "Phone",
    },
    {
      key: React.useId(),
      href: "#Password",
      title: "Password",
    },
  ];
  return <Anchor items={menus} />;
};

export default SidebarProfile;
