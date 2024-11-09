import { Button, Card, List, Skeleton, Typography } from "antd";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { ProductCard } from "@/shared/CardCustom";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { TCategory, TJewelry } from "@/types";

type Props = {
	jewelryModels: TJewelry[];
	category: TCategory;
	isLoading: boolean;
};

const CategoryTemplate: React.FC<Props> = ({
	jewelryModels,
	category,
	isLoading = false,
}) => {
	if (isLoading) {
		return (
			<List
				grid={{
					gutter: 16,
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 4,
				}}
				dataSource={Array.from({ length: 4 }, (_, index) => index + 1)}
				renderItem={(item, index) => (
					<List.Item key={index}>
						<Card
							className="flex flex-col justify-stretch overflow-hidden h-72 shadow-md hover:shadow-lg transition-shadow duration-300"
							cover={
								<div className="h-40 max-h-40 overflow-hidden">
									<Skeleton.Image
										active
										className="w-full h-full"
									/>
								</div>
							}
						>
							<div className="flex justify-around items-center flex-col gap-4">
								<Skeleton active paragraph />
							</div>
						</Card>
					</List.Item>
				)}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Typography.Title
				level={4}
				className="bg-gray-200 text-center font-semibold rounded-lg p-1 sm:p-2 "
			>
				{category.name}
			</Typography.Title>
			{jewelryModels.length !== 0 ? (
				<List
					grid={{
						gutter: 16,
						xs: 2,
						sm: 2,
						md: 2,
						lg: 4,
						xl: 4,
					}}
					dataSource={jewelryModels}
					renderItem={(item) => (
						<List.Item className="h-full" key={item.id}>
							<ProductCard jewelry={item} />
						</List.Item>
					)}
				/>
			) : (
				<EmptyCustom />
			)}

			<Link href={routesUser.product + "?categoryId=" + category.id}>
				<Button
					className="w-full"
					icon={<ArrowBigRight size={16} />}
					iconPosition="end"
				>
					Xem thêm
				</Button>
			</Link>
		</div>
	);
};

export default CategoryTemplate;
