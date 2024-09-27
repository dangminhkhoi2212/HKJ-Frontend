import { create } from "zustand";

import { TAccountInfo } from "@/types";

type TAccountStore = {
  account: TAccountInfo | null | undefined;
  isLoading: boolean;
  setAccount: (account: TAccountInfo) => void;
  setIsLoading: (isLoading: boolean) => void;
};
const useAccountStore = create<TAccountStore>((set) => ({
  account: null,
  isLoading: true,
  setAccount: (account: TAccountInfo) => {
    set({ account });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));

export default useAccountStore;
