import React from "react";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { cn } from "@/utils/cn";
import {
  Image as ImageIcon,
  SearchCheckIcon,
  Search as SearchIcon,
} from "lucide-react";

const { Search } = Input;
const SearchHeader = () => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <div className="flex justify-center items-center gap-2">
      <Search
        placeholder="Tìm kiếm"
        allowClear={true}
        size="middle"
        onSearch={onSearch}
        className={"w-72 "}
      />
      <label
        htmlFor="search_image"
        className="p-1 rounded-md border-2 border-dashed cursor-pointer"
      >
        <ImageIcon size={24} />
        <input type="file" name="image" id="search_image" className="hidden" />
      </label>
    </div>
  );
};

export default SearchHeader;
