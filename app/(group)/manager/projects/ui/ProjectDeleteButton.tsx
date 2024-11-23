import { App, Button, Modal } from "antd";
import { Trash } from "lucide-react";
import React, { useState } from "react";

import { KEY_CONST } from "@/const";
import projectService from "@/services/projectService";
import { TProject } from "@/types";
import { useMutation } from "@tanstack/react-query";

type Props = { project: TProject; refresh: () => void };

const ProjectDeleteButton: React.FC<Props> = ({ project, refresh }) => {
	const [showModel, setShowModel] = useState<boolean>(false);
	const message = App.useApp().message;
	const handleDelete = useMutation({
		mutationFn: () => {
			return projectService.deleteOne(project?.id!);
		},
		onSuccess: () => {
			message.success("Đã xóa dự án");
			setShowModel(false);
			refresh();
		},
		onError: (error) => {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
	});
	return (
		<div>
			<Modal
				title="Xóa dự án"
				okText="Xóa"
				cancelText="Hủy"
				onOk={() => handleDelete.mutate()}
				onCancel={() => setShowModel(false)}
				open={showModel}
				okButtonProps={{
					danger: true,
					loading: handleDelete.isPending,
				}}
				cancelButtonProps={{ disabled: handleDelete.isPending }}
			>
				<p>
					Bạn có chắc chắn muốn xóa dự án{" "}
					<span className="font-semibold">{project?.name}</span>
				</p>
			</Modal>
			<Button
				danger
				type="primary"
				onClick={() => setShowModel(true)}
				icon={<Trash size={18} />}
			></Button>
		</div>
	);
};

export default ProjectDeleteButton;
