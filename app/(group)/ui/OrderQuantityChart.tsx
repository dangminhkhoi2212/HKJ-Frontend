import { Spin } from "antd";
import React, { useMemo } from "react";

import { statisticService } from "@/services";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { Line, LineConfig } from "@ant-design/plots";
import { useQuery } from "@tanstack/react-query";

import { TStatisticQuery } from "./StatisticDashBoard";

type Props = { query: TStatisticQuery };
const initValue = Array.from({ length: 10 }).map((value, index) => ({
	time: value,
	value: value,
}));
const OrderQuantityChart: React.FC<Props> = ({ query }) => {
	const getStatistic = useQuery({
		queryKey: ["statistic-order-count", query],
		queryFn: () =>
			statisticService.getOrderQuantityByTime(query.input, query.type),
	});

	const data = getStatistic?.data!;

	// Format the y values as currency
	const formattedData =
		data?.map((item) => ({
			...item,
			value: new Intl.NumberFormat("vi-VN", {
				style: "currency",
				currency: "VND",
				currencyDisplay: "code",
			}).format(item.value),
		})) || initValue;
	const config: LineConfig = {
		data,
		xField: "time",
		yField: "value",
		point: {
			shapeField: "square",
			sizeField: 4,
		},
		interaction: {
			tooltip: {
				marker: false,
			},
		},
		tooltip: (
			d, // Every data item
			index: number, // index
			data, // Complete data
			column // Channel
		) => ({
			name: "Số lượng",
			value: `${column.y.value[index]}`,
		}),
		style: {
			lineWidth: 2,
		},
	};

	const renderChart = useMemo(() => {
		if (getStatistic.isFetching) return <Spin />;
		if (!getStatistic?.data?.length) return <EmptyCustom />;
		return <Line {...config} />;
	}, [getStatistic.isFetching, getStatistic.data]);

	return (
		<div className="flex flex-col items-center min-h-96">
			<div>
				<LabelCustom label="Biểu đồ thống kê số lượng đơn" />
			</div>

			{renderChart}
		</div>
	);
};

export default OrderQuantityChart;
