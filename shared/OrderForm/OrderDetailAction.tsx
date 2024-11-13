import { App, Button } from "antd";
import { Modal } from "antd/lib";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useRouterCustom } from "@/hooks";
import { routesUser } from "@/routes";
import { orderService } from "@/services";
import { TStatus } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Props = { isPending?: boolean; role?: "user" | "manager" };
type TForm = {};
const UpdateButton: React.FC<{}> = () => (
	<Button type="primary" htmlType="submit">
		Cập nhật
	</Button>
);
const PlaceButton: React.FC<{}> = () => (
	<Button type="primary" htmlType="submit">
		Đặt hàng
	</Button>
);
const CancelButton: React.FC<{ setModelDelete: (value: boolean) => void }> = ({
	setModelDelete,
}) => (
	<Button type="primary" danger onClick={() => setModelDelete(true)}>
		Hủy đơn hàng
	</Button>
);
const ReciveButton: React.FC<{ setModelRecive: (value: boolean) => void }> = ({
	setModelRecive,
}) => (
	<Button type="primary" onClick={() => setModelRecive(true)}>
		Nhận hàng
	</Button>
);
const OrderDetailAction: React.FC<Props> = ({ isPending, role = "user" }) => {
	const { getValues, setValue } = useFormContext();
	const [modelDelete, setModelDelete] = useState<boolean>(false);
	const [modelRecive, setModelRecive] = useState<boolean>(false);
	const order = getValues();
	const router = useRouterCustom().router;
	const message = App.useApp().message;
	const RenderButton = () => {
		if (role === "manager") {
			switch (order?.status) {
				case TStatus.NEW: {
					return (
						<div className="grid grid-cols-2 gap-4">
							<CancelButton setModelDelete={setModelDelete} />
							<UpdateButton />
						</div>
					);
				}
				case TStatus.IN_PROCESS: {
					return <UpdateButton />;
				}
			}
		} else {
			if (order?.status === TStatus.NEW) {
				if (!order.id) {
					return <PlaceButton />;
				}
				return <CancelButton setModelDelete={setModelDelete} />;
			}
			if (order?.status === TStatus.COMPLETED) {
				return <ReciveButton setModelRecive={setModelRecive} />;
			}
		}
	};
	const handleCancel = useMutation({
		mutationFn: () =>
			orderService.updatePartical({
				id: Number.parseInt(order?.id),
				status: TStatus.CANCEL,
			}),
		onSuccess: () => {
			message.success("Đã hủy đơn hàng");
			router.push(`${routesUser.order}?status=${TStatus.CANCEL}`);
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	const handleRevice = useMutation({
		mutationFn: () =>
			orderService.updatePartical({
				id: Number.parseInt(order.id),
				status: TStatus.DELIVERED,
				actualDeliveryDate: dayjs().toISOString(),
			}),
		onSuccess: () => {
			message.success("Đã nhận hàng");
			router.push(`${routesUser.order}?status=${TStatus.DELIVERED}`);
		},
		onError: () => {
			message.error("Đã có lỗi xảy ra. Vui lòng thử lại");
		},
	});
	return (
		<>
			<Modal
				title="Hủy đơn hàng"
				open={modelDelete}
				onCancel={() => setModelDelete(false)}
				onOk={() => handleCancel.mutate()}
				okButtonProps={{
					danger: true,
					loading: handleCancel.isPending,
				}}
				cancelButtonProps={{ disabled: handleCancel.isPending }}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<p>Bạn có muốn hủy đơn hàng này?</p>
			</Modal>
			<Modal
				title="Nhận hàng"
				open={modelRecive}
				onCancel={() => setModelRecive(false)}
				onOk={() => handleRevice.mutate()}
				okButtonProps={{
					loading: handleRevice.isPending,
				}}
				cancelButtonProps={{ disabled: handleRevice.isPending }}
				okText="Đồng ý"
				cancelText="Hủy"
			>
				<p>Xác nhận nhận hàng?</p>
			</Modal>
			{RenderButton()}
			{/* <Button type="primary" htmlType="submit" loading={isPending}>
				Đặt hàng
			</Button> */}
		</>
	);
};

export default OrderDetailAction;
