import { App, Modal } from "antd";
import React from "react";
import { useMutation } from "react-query";

import { KEY_CONST } from "@/const";
import templateService from "@/services/templateService";

import { templateStore } from "../store";

type Props = {};
const DeleteTemplateFrom: React.FC<{}> = ({}) => {
	const { setToggleRefresh, templateDelete, setTemplateDelete } =
		templateStore();
	const message = App.useApp().message;
	console.log("🚀 ~ templateDelete:", templateDelete);
	const {
		data: _,
		mutate,
		isLoading,
	} = useMutation({
		mutationFn: () => {
			return templateService.deleteOne(templateDelete?.id!);
		},
		onSuccess() {
			setToggleRefresh();
			setTemplateDelete(null);
		},
		onError() {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	console.log("🚀 ~ template:", templateDelete);
	return (
		<Modal
			title="Xóa bản mẫu"
			onOk={() => mutate()}
			open={!!templateDelete}
			onCancel={() => setTemplateDelete(null)}
			okButtonProps={{ danger: true, loading: isLoading }}
			cancelButtonProps={{ disabled: isLoading }}
		>
			<p>
				Bạn có muốn xóa bản mầu{" "}
				<span className="font-bold">{templateDelete?.name}</span>
			</p>
		</Modal>
	);
};

export default DeleteTemplateFrom;
