import { ThemeConfig } from "antd";

import { COLORS_CONST } from "../const";

const themeConfig: ThemeConfig | undefined = {
  token: {
    colorPrimary: COLORS_CONST.colors.accent.DEFAULT,
    borderRadius: 10,
  },
};
export default themeConfig;
