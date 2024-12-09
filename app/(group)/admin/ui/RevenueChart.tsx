import { Spin } from "antd";
import React, { useMemo } from "react";

import { statisticService } from "@/services";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { LabelCustom } from "@/shared/FormCustom/InputCustom";
import { Column, ColumnConfig } from "@ant-design/plots";
import { useQuery } from "@tanstack/react-query";

import { TStatisticQuery } from "./StatisticDashBoard";

type Props = { query: TStatisticQuery };
const initValue = Array.from({ length: 10 }).map((value, index) => ({
	time: value,
	value: value,
}));
const RevenueChart: React.FC<Props> = ({ query }) => {
	const getStatistic = useQuery({
		queryKey: ["statistic-revenue", query],
		queryFn: () =>
			statisticService.getRevenueByGranularity(query.input, query.type),
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

	const config: ColumnConfig = {
		data: formattedData,
		xField: "time",
		yField: "value",
		style: {
			radiusTopLeft: 10,
			radiusTopRight: 10,
			lineWidth: 2,
		},
		shapeField: "column25D",
		tooltip: (
			d, // Every data item
			index: number, // index
			data, // Complete data
			column // Channel
		) => ({
			name: "Doanh thu",
			value: `${column.y.value[index]}`,
		}),
	};

	const renderChart = useMemo(() => {
		if (getStatistic.isFetching) return <Spin />;
		if (!getStatistic?.data?.length) return <EmptyCustom />;
		return <Column {...config} />;
	}, [getStatistic.isFetching, getStatistic.data]);

	return (
		<div className="flex flex-col  justify-stretch items-center min-h-96">
			<div>
				<LabelCustom label="Biểu đồ thống kê doanh thu" />
			</div>

			{renderChart}
		</div>
	);
};

export default RevenueChart;
