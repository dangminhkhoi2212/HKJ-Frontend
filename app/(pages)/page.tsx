"use client";
import Logo from "@/shared/Logo";
import useAccountStore from "@/stores/account";
import { message } from "@/stores/antd";
import { App, Button, Space } from "antd";

export default function HomePage() {
  const account = useAccountStore((state) => state.account);
  const { message } = App.useApp();

  const show = () => {
    message.warning({
      content: "some messages...some messages...",
    });
  };
  return (
    <Space>
      <Button type="primary" color="error" onClick={show}>
        Open message
      </Button>
    </Space>
  );
}
