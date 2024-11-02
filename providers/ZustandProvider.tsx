// src/providers/counter-store-provider.tsx
"use client";

import { createContext, ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { createAccountStore, TAccountStore } from '@/stores/accountStore';

export type CounterStoreApi = ReturnType<typeof createAccountStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
	undefined
);

export interface CounterStoreProviderProps {
	children: ReactNode;
}

export const ZustandProvider = ({ children }: CounterStoreProviderProps) => {
	const storeRef = useRef<CounterStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createAccountStore();
	}

	return (
		<CounterStoreContext.Provider value={storeRef.current}>
			{children}
		</CounterStoreContext.Provider>
	);
};

export const useAccountStore = <T,>(
	selector: (store: TAccountStore) => T
): T => {
	const counterStoreContext = useContext(CounterStoreContext);

	if (!counterStoreContext) {
		throw new Error(`useAccountStore must be used within ZustandProvider`);
	}

	return useStore(counterStoreContext, selector);
};
