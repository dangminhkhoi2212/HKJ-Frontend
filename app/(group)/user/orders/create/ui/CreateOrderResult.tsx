import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";

type Props = {};

const CreateOrderResult: React.FC<Props> = ({}) => {
	return (
		<Result
			status="success"
			title="Đơn hàng của bạn đã đặt thành công"
			subTitle=""
			extra={[
				<Link href={routesUser.order} key={routesUser.order}>
					<Button type="primary" key="console">
						Xem đơn hàng
					</Button>
				</Link>,
			]}
		/>
	);
};

export default CreateOrderResult;
