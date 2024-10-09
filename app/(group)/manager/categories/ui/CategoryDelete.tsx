import { App, Modal } from "antd";
import { useMutation } from "react-query";

import { KEY_CONST } from "@/const";
import categoryService from "@/services/categoryService";
import { TCategory } from "@/types";

import categoryStore from "../store";

const CategoryDelete: React.FC<{}> = () => {
	const { categoryDelete, setCategoryDelete, setToggleRefresh } =
		categoryStore();
	const { message } = App.useApp();
	const { mutate, isLoading } = useMutation({
		mutationFn: () =>
			categoryService.update({ ...categoryDelete, isDeleted: true }),
		onSuccess() {
			message.success(`Đã xóa danh mục ${categoryDelete.name}`);
			setToggleRefresh();
		},
		onError() {
			message.error(KEY_CONST.ERROR_MESSAGE);
		},
		onSettled() {
			setCategoryDelete({} as TCategory);
		},
	});
	return (
		<Modal
			title="Xóa danh mục này"
			open={!!categoryDelete.id}
			onCancel={() => setCategoryDelete({} as TCategory)}
			cancelText="Huỷ"
			okText="Đồng ý"
			onOk={() => mutate()}
			okType={"primary"}
			okButtonProps={{ danger: true }}
			cancelButtonProps={{ disabled: isLoading }}
			confirmLoading={isLoading}
		>
			<p>Bạn có muốn xóa danh mục {categoryDelete.name}</p>
		</Modal>
	);
};

export default CategoryDelete;
