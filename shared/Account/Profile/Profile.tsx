"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import Frame from "@/shared/Frame";

const Profile: React.FC = () => {
  const router = useRouter();
  return (
    <Frame
      title="Thông tin tài khoản"
      classsName="flex flex-col "
      discription={
        <p>
          Tài khoản của bạn được quản lý bởi{" "}
          <span className="font-bold">KeyCloak</span>
        </p>
      }
    >
      <p>
        Hãy cập nhật thông tin tài khoản{" "}
        <Link
          href={process.env.NEXT_PUBLIC_KEYCLOAK_ACCOUNT_DASHBOARD_URL || ""}
        >
          Tại đây
        </Link>
      </p>
    </Frame>
  );
};

export default Profile;
