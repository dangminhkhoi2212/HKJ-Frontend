import React from "react";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { cn } from "@/utils/cn";

const { Search } = Input;
const SearchText = () => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <Search
      placeholder="Tìm kiếm"
      allowClear={true}
      size="middle"
      onSearch={onSearch}
      className={"!w-72 "}
    />
  );
};

export default SearchText;
