"use client";
import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import React from "react";

import { ImageSearchButton } from "@/shared/ImageSearchButton";

const { Search } = Input;
type Props = SearchProps & {};

const SearchImage: React.FC<Props> = ({ ...props }) => {
	return (
		<div className="flex justify-center items-center gap-2">
			<Search
				placeholder="Tìm kiếm"
				allowClear={true}
				size="small"
				className={"max-w-72 "}
				{...props}
			/>
			<ImageSearchButton />
		</div>
	);
};

export default SearchImage;
