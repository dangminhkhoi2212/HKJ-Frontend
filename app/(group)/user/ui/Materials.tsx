"use client";
import { List } from "antd";
import React from "react";

import { QUERY_CONST } from "@/const";
import { materialService } from "@/services";
import { Frame } from "@/shared/Frame";
import { TMaterial } from "@/types";
import { useQuery } from "@tanstack/react-query";

import MaterialCard from "./MaterialCard";

type Props = {};

const { defaultQuery } = QUERY_CONST;
const Materials: React.FC<Props> = ({}) => {
	const getMaterial = useQuery({
		queryKey: ["material"],
		queryFn: () => materialService.get({ ...defaultQuery, size: 200 }),
	});
	return (
		<Frame title="Chất liệu thịnh hành" classsName="">
			<List
				grid={{
					gutter: 16,
					xs: 2,
					sm: 2,
					md: 4,
					lg: 4,
					xl: 6,
					xxl: 3,
				}}
				className="flex justify-center items-center gap-4"
				dataSource={getMaterial.data}
				renderItem={(item: TMaterial) => (
					<List.Item key={item.id} className="gap-4">
						<MaterialCard material={item} />
					</List.Item>
				)}
			/>
		</Frame>
	);
};

export default Materials;
