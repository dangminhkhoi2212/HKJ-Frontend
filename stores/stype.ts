import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UseStyleStoreType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  colorBgContainer: string;
  borderRadiusLG: number;
  setToken: (colorBgContainer: string, borderRadiusLG: number) => void;
};

const useStyleStore = create<UseStyleStoreType>()(
  devtools((set, get) => ({
    collapsed: false,
    colorBgContainer: "",
    borderRadiusLG: 0,
    toggleCollapsed: () => set(() => ({ collapsed: !get().collapsed })),
    setToken: (colorBgContainer, borderRadiusLG) =>
      set(() => ({ colorBgContainer, borderRadiusLG })),
  }))
);

export default useStyleStore;
