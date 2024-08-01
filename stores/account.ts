import { create } from "zustand";

export type TAccountInfo = {
  id: number | null;
  login: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string | null;
  activated: boolean | null;
  langKey: string | null;
  createdBy: string | null;
  createdDate: string | null;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  authorities: string[] | null;
};
type TAccountStore = {
  account: TAccountInfo | null;
  setAccount: (account: TAccountInfo) => void;
};
const useAccountStore = create<TAccountStore>((set) => ({
  account: null,
  setAccount: (account: TAccountInfo) => {
    set({ account });
  },
}));

export default useAccountStore;
