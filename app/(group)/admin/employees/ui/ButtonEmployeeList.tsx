import { Button, message, Modal } from "antd";
import React, { useState } from "react";

import { userExtraService } from "@/services";
import { TEmployee } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Props = { record: TEmployee; refetch: () => void };

const ButtonEmployeeList: React.FC<Props> = ({ record, refetch }) => {
	const [open, setOpen] = useState<{
		open: boolean;
		type: "active" | "inActive" | null;
	}>({ open: false, type: null });
	const handleButton = useMutation({
		mutationFn: (status: "active" | "inActive") => {
			let active = status === "active";

			return userExtraService.updatePartical({
				id: record.id,
				active,
			});
		},
		onSuccess: () => {
			refetch();
			message.success("Đẵ khóa tài khoản thành công");
			setOpen({ open: false, type: null });
		},
		onError(error: any) {
			message.error(error.response.data.message);
		},
	});
	return (
		<div>
			<Modal
				title="Khóa tài khoản"
				open={open.open}
				onCancel={() => setOpen({ open: false, type: null })}
				onOk={() =>
					handleButton.mutate(open.type as "active" | "inActive")
				}
				okButtonProps={{
					loading: handleButton.isPending,
					danger: open.type === "inActive",
				}}
				cancelButtonProps={{ disabled: handleButton.isPending }}
			>
				<p>Bạn có muốn khóa tài khoản này không?</p>
			</Modal>
			{!record.active ? (
				<Button onClick={() => setOpen({ open: true, type: "active" })}>
					Mở khóa
				</Button>
			) : (
				<Button
					onClick={() => setOpen({ open: true, type: "inActive" })}
					danger
				>
					Khóa
				</Button>
			)}
		</div>
	);
};

export default ButtonEmployeeList;
