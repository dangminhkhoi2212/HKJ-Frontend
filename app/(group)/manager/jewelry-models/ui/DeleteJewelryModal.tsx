import { App, Modal } from "antd";
import React from "react";

import { jewelryService } from "@/services";
import { useMutation } from "@tanstack/react-query";

import { jewelryStore } from "../store";

type Props = {};

const DeleteJewelryModal: React.FC<Props> = ({}) => {
	const jewelry = jewelryStore((state) => state.jewelry);
	const setJewelry = jewelryStore((state) => state.setJewelry);
	const setForceRefresh = jewelryStore((state) => state.setForceRefresh);
	const message = App.useApp().message;
	const handleDelete = useMutation({
		mutationFn: () => {
			return jewelryService.updatePartical({
				id: jewelry?.id,
				isDeleted: true,
			});
		},
		onSuccess: () => {
			setJewelry(null);
			message.success(`Đã xóa ${jewelry?.name} thành công`);
			setForceRefresh(true);
		},
	});
	return (
		<Modal
			title="Xóa sản phẩm"
			okText="Xóa"
			cancelText="Hủy"
			onOk={() => handleDelete.mutate()}
			onCancel={() => setJewelry(null)}
			open={!!jewelry?.id}
			okButtonProps={{ danger: true, loading: handleDelete.isPending }}
			cancelButtonProps={{ disabled: handleDelete.isPending }}
		>
			<p>
				Bạn có chắc chắn muốn xóa{" "}
				<span className="font-semibold">{jewelry?.name}</span>
			</p>
		</Modal>
	);
};

export default DeleteJewelryModal;
