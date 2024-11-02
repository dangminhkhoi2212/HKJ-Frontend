import { Layout } from "antd";
import React from "react";

type Props = { children: React.ReactNode };
const { Content } = Layout;
const UserContent: React.FC<Props> = ({ children }) => {
	return (
		<Content className="w-full overflow-auto p-5 flex flex-col gap-5">
			{children}
		</Content>
	);
};

export default UserContent;
