"use client";
import { Divider } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

import FilterStatistic from "./FilterStatistic";
import OrderQuantityChart from "./OrderQuantityChart";
import RevenueChart from "./RevenueChart";
import StatisticCard from "./StatisticCard";

type Props = {};
export type TStatisticQuery = {
	input: string;
	type: "day" | "month" | "year";
};
const StatisticDashBoard: React.FC<Props> = ({}) => {
	const [query, setQuery] = useState<TStatisticQuery>({
		input: dayjs().toISOString(),
		type: "year",
	});

	return (
		<div className="flex flex-col gap-6 justify-center items-center">
			<StatisticCard />
			<FilterStatistic setQuery={setQuery} query={query} />
			<RevenueChart query={query} />
			<Divider type="horizontal" />
			<OrderQuantityChart query={query} />
		</div>
	);
};

export default StatisticDashBoard;
