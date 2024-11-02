import { App as AppAntd, ConfigProvider } from "antd";
import React from "react";

import themeConfig from "@/config/theme";

const LayoutConfig = ({ children }: React.PropsWithChildren) => {
	return (
		<ConfigProvider theme={themeConfig}>
			<AppAntd>{children}</AppAntd>
		</ConfigProvider>
	);
};

export default LayoutConfig;
