import { Card, Spin, Statistic } from "antd";
import { StatisticProps } from "antd/lib";
import { ClipboardMinus, Gem, User } from "lucide-react";
import React from "react";
import CountUp from "react-countup";

import { statisticService } from "@/services";
import { EmptyCustom } from "@/shared/EmptyCustom";
import { useQuery } from "@tanstack/react-query";

type Props = {};
const formatter: StatisticProps["formatter"] = (value) => (
	<CountUp end={value as number} separator="," />
);
const StatisticCard: React.FC<Props> = ({}) => {
	const getStatistic = useQuery({
		queryKey: ["statistic-count"],
		queryFn: () => statisticService.getQuantity(),
	});
	const data = getStatistic?.data!;
	if (!data) return <EmptyCustom />;
	return (
		<Spin spinning={getStatistic.isLoading}>
			<div className="grid grid-cols-4 w-full gap-4">
				<Card>
					<Statistic
						prefix={<ClipboardMinus size={16} />}
						title="Đơn hàng"
						value={data["order"]}
						formatter={formatter}
					/>
				</Card>
				<Card>
					<Statistic
						title="Tổng danh thu"
						value={data["revenue"]}
						formatter={formatter}
						suffix=" VND"
					/>
				</Card>
				<Card>
					<Statistic
						prefix={<Gem size={16} />}
						title="Số lượng trang sức"
						value={data["product"]}
						formatter={formatter}
					/>
				</Card>
				<Card>
					<Statistic
						prefix={<User size={16} />}
						title="Số lượng người dùng"
						value={data["account"]}
						formatter={formatter}
					/>
				</Card>
			</div>
		</Spin>
	);
};

export default StatisticCard;
