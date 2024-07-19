import { Tag } from "antd";
import { Camera } from "lucide-react";
import React from "react";

const SearchImage = () => {
  return (
    <Tag className="!py-1 !flex items-center gap-5" color="processing">
      <p className="text-accent-300">Tìm kiếm những mẫu có sẵn bằng hình ảnh</p>
      <label
        htmlFor="search_image"
        className="p-2 rounded-md border border-dashed cursor-pointer"
      >
        <Camera size={18} />
        <input type="file" name="image" id="search_image" className="hidden" />
      </label>
    </Tag>
  );
};

export default SearchImage;
