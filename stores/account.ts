import Cookies from 'js-cookie';
import { create } from 'zustand';

import { KEY_CONST } from '@/const';
import { TAccountInfo } from '@/types';

const { ACCOUNT_ID_COOKIE } = KEY_CONST;
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
		if (account) {
			// Lưu vào cookie khi set account
			Cookies.set(ACCOUNT_ID_COOKIE, JSON.stringify(account.id));
		} else {
			// Xóa cookie khi account là null
			Cookies.remove(ACCOUNT_ID_COOKIE);
		}
		set({ account });
	},
	setIsLoading: (isLoading: boolean) => {
		set({ isLoading });
	},
}));

export default useAccountStore;
