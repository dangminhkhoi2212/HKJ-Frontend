import { Tag } from "antd";
import React from "react";

import { Frame } from "@/shared/Frame";

import ImageSearchTabs from "./ui/ImageSearchTabs";

type Props = {};

const ImageSearchPage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Tìm kiếm hình ảnh">
			<Tag color="cyan">
				Để hạn chế quá tải cho server thì hình ảnh sẽ tự động thực hiện
				chuyển đổi để cho phép tìm kiếm bằng hình ảnh vào 00:00 hằng
				ngày
			</Tag>
			<ImageSearchTabs />
		</Frame>
	);
};

export default ImageSearchPage;
