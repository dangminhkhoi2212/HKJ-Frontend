"use client";
import { Button, Card, Divider, Input } from "antd";
import { SearchProps } from "antd/es/input";
import { ChevronsRight, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const ManagerPage: React.FC = () => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  const { Search } = Input;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5 justify-start">
        <Button type="primary" icon={<Plus />}>
          Tạo dự án
        </Button>
        <Search
          placeholder="Tìm kiếm dự án"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </div>
      <Divider className="m-0 p-0" />
      <div className="flex gap-5 justify-start">
        <Card
          title="Nhẫn kim cương trái tim"
          extra={
            <Link href={"#"}>
              <ChevronsRight />
            </Link>
          }
          style={{ width: 300 }}
        >
          <p>Đặng Minh Khôi</p>
          <p className="text-sm italic">
            <span className="font-bold">ID: </span>12lmlmb-1243nlk1n2-bwelr
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ManagerPage;
