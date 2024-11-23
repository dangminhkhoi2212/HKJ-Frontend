import { Space, Spin, Typography } from "antd";
import React from "react";

import { materialUsageService } from "@/services";
import { TMaterialUsage } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Props = { productId: number };

const ProductMaterialUsage: React.FC<Props> = ({ productId }) => {
	const { data: materialUsage, isLoading } = useQuery({
		queryKey: ["materialUsage", { jewelryId: { equals: productId } }],
		queryFn: () =>
			materialUsageService.get({ jewelryId: { equals: productId } }),
		enabled: !!productId,
	});

	return (
		<Spin spinning={isLoading}>
			<div className="flex flex-col gap-2 text-lg">
				<Typography.Title level={4} className="m-0">
					Chất liệu
				</Typography.Title>
				<Space direction="vertical">
					{isLoading ? (
						<Typography.Text>Đang tải dữ liệu...</Typography.Text>
					) : materialUsage && materialUsage.length > 0 ? (
						materialUsage.map((item: TMaterialUsage) => (
							<p key={item.id} className="text-md">
								<span>{item?.material?.name}:</span>{" "}
								{item?.usage} {item?.material?.unit}
							</p>
						))
					) : (
						<Typography.Text type="danger">
							Không tìm thấy thông tin chất liệu.
						</Typography.Text>
					)}
				</Space>
			</div>
		</Spin>
	);
};

export default ProductMaterialUsage;
