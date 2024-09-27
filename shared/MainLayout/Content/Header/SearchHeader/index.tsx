import { Input, Tooltip } from "antd";
import { SearchProps } from "antd/es/input";
import { Image as ImageIcon } from "lucide-react";
import React from "react";

const { Search } = Input;
type Props = {};
const SearchHeader: React.FC<Props> = () => {
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
      <Tooltip title="Tìm kiếm với hình ảnh">
        <label
          htmlFor="search_image"
          className="h-fit p-1 rounded-md border-2 border-dashed cursor-pointer"
        >
          <ImageIcon size={24} className="!fill-slate-50" />
          <input
            type="file"
            name="image"
            id="search_image"
            className="hidden"
          />
        </label>
      </Tooltip>
    </div>
  );
};

export default SearchHeader;
