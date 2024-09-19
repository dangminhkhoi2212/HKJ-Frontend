import { create } from "zustand";

export type TAccountInfo = {
  id: string | null | undefined;
  idKeyCloak: string | null | undefined;
  login: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  email: string | null | undefined;
  imageUrl: string | null | undefined;
  phone: string | null | undefined;
  activated: boolean | null | undefined;
  langKey: string | null | undefined;
  createdBy: string | null | undefined;
  createdDate: string | null | undefined;
  lastModifiedBy: string | null | undefined;
  lastModifiedDate: string | null | undefined;
  authorities: string[] | null | undefined;
  address: string | null | undefined;
};
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
