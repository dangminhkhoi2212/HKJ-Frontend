import { Timeline } from "antd";

const items = [
	{
		children: "Truy cập vào trang quản lí tài khoản trên Keycloak",
	},
	{
		children: "Chọn vào mục Users",
	},
	{
		children:
			"Tạo người dùng mới bằng cách thêm các thuộc tính của tài khoản (username, email, số điện thoại, tên,....)",
	},
	{
		children:
			'Sau khi nhấn lưu hãy chuyển qua mục "Attributes" để thêm thuộc tính đồng bộ. Với ô đầu tiên ghi "sync", ô thứ 2 bên cạnh điền giá trị là "false"',
	},
	{
		children:
			'Tiếp đó sang mục "Cerdentials" để thêm mật khẩu cho tài khoản',
	},
	{
		children: "Quay lại trang web và nhấn nút đồng bộ tài khoản",
	},
];
const TimeLineAccount: React.FC<{}> = () => {
	return <Timeline items={items} />;
};

export default TimeLineAccount;
