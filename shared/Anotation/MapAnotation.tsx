import { Divider, Space, Tag } from "antd";
import { memo } from "react";

import { TPriority } from "@/types";
import { tagMapperUtil } from "@/utils";

const { colorPriority } = tagMapperUtil;
const MapAnotations: React.FC = memo(() => (
	<Space className="flex">
		<Space direction="vertical">
			<p className="font-semibold">Độ ưu tiên</p>
			<Space>
				<Tag color={colorPriority(TPriority.LOW)}>Thấp</Tag>
				<Tag color={colorPriority(TPriority.MEDIUM)}>Trung Bình</Tag>
				<Tag color={colorPriority(TPriority.HIGH)}>Cao</Tag>
			</Space>
		</Space>
		<Divider type="vertical" className="m-1 h-fit" />
		<Space direction="vertical">
			<p className="font-semibold">Chú thích</p>
			<Space>
				<span>DA: Dự án</span>
				<span>CĐ: Công đoạn</span>
			</Space>
		</Space>
	</Space>
));
export default MapAnotations;
