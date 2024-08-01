import { create } from "zustand";
import { persist } from "zustand/middleware";

type TTokenStore = {
  accessToken: string;
  setAccessToken: (token: string) => void;
};
const useTokenStore = create<TTokenStore>()(
  persist(
    (set) => ({
      accessToken: "",
      setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
    }),
    {
      name: "accessToken",
    }
  )
);
export default useTokenStore;
