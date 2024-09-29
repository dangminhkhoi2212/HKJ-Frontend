"use client";
import { Button, Result } from "antd";

import { useRouterCustom } from "@/hooks";
import { routes } from "@/routes";

export default function NotFound() {
  const { router } = useRouterCustom();
  return (
    <div className="h-screen flex justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn yêu cầu không tồn tại"
        extra={
          <Button type="primary" onClick={() => router.push(routes.home)}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}
