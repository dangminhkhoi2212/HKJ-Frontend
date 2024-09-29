"use client";
import { Input } from "antd";
import { InputRef, SearchProps } from "antd/es/input";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { cn } from "@/utils";

const { Search } = Input;

type TInputSearchFormProps = {
  handleSearch: SearchProps["onSearch"];
} & SearchProps &
  React.RefAttributes<InputRef>;
const InputSearchCustom: React.FC<TInputSearchFormProps> = ({
  handleSearch,
  ...props
}) => {
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const textSearch: string | null = searchParams.get("textSearch");
    if (textSearch) {
      setText(textSearch);
    }
  }, [searchParams]);

  return (
    <Search
      placeholder="Tìm kiếm"
      allowClear
      {...props}
      value={text}
      onSearch={handleSearch}
      className={cn("w-72", props.className)}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default InputSearchCustom;
