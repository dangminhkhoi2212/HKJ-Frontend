import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UseStyleStoreType = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const useStyleStore = create<UseStyleStoreType>()(
  devtools((set, get) => ({
    collapsed: false,
    colorBgContainer: "",
    borderRadiusLG: 0,
    toggleCollapsed: () => set(() => ({ collapsed: !get().collapsed })),
  }))
);

export default useStyleStore;
