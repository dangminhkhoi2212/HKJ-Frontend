import { App as AppAntd, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import React from "react";

import themeConfig from "@/config/theme";

const LayoutConfig = ({ children }: React.PropsWithChildren) => {
	return (
		<ConfigProvider theme={themeConfig} locale={viVN}>
			<AppAntd>{children}</AppAntd>
		</ConfigProvider>
	);
};

export default LayoutConfig;
