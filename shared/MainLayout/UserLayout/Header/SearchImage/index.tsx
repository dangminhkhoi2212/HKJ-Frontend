"use client";
import { Input, Tooltip } from "antd";
import { SearchProps } from "antd/es/input";
import { Image as ImageIcon } from "lucide-react";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { imageSearchAIStore } from "@/stores";

const { Search } = Input;
type Props = SearchProps & {};
const SearchImage: React.FC<Props> = ({ ...props }) => {
	const { router } = useRouterCustom();
	const setFile = imageSearchAIStore((state) => state.setFile);
	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		console.log("🚀 ~ handleOnChange ~ file:", file);
		if (!file) return;
		setFile(file);
		router.push(routesUser.product);
	};
	return (
		<div className="flex justify-center items-center gap-2">
			<Search
				placeholder="Tìm kiếm"
				allowClear={true}
				size="middle"
				className={"w-72 "}
				{...props}
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
						onChange={handleOnChange}
						accept="image/*"
					/>
				</label>
			</Tooltip>
		</div>
	);
};

export default SearchImage;
