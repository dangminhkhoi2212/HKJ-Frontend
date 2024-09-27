"use client";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
const { Search } = Input;

type TInputSearchFormProps = {
  handleSearch: (value: string) => void;
};
const InputSearchCustom: React.FC<TInputSearchFormProps> = ({
  handleSearch,
}) => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    handleSearch(value);
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const textSearch: string | null = searchParams.get("textSearch");
    if (textSearch) {
      setText(textSearch);
    }
  }, [searchParams]);

  return (
    <div>
      <Search
        placeholder="Tìm kiếm"
        allowClear
        value={text}
        onSearch={onSearch}
        className="w-60"
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default InputSearchCustom;
