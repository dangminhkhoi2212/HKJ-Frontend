import { createStore } from 'zustand/vanilla';

// src/stores/counter-store.ts
import { TAccountInfo } from '@/types';

export type AccountState = {
	account: TAccountInfo | null | undefined;
};

export type AccountActions = {
	setAccount: (account: TAccountInfo | null | undefined) => void;
};

export type TAccountStore = AccountState & AccountActions;

export const defaultInitState: AccountState = {
	account: null,
};

export const createAccountStore = (
	initState: AccountState = defaultInitState
) => {
	return createStore<TAccountStore>()((set) => ({
		...initState,
		setAccount: (account) => set((state) => ({ account })),
	}));
};
