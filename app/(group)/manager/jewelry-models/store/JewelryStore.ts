import { create } from "zustand";

import { TJewelry } from "@/types/jewelryType";

type TState = {
	jewelry: TJewelry | null;
	forceRefresh: boolean;
};
type TActions = {
	reset: () => void;
	setJewelry: (data: TJewelry | null) => void;
	setForceRefresh: (data: boolean) => void;
};

const initValues: TState = {
	jewelry: null,
	forceRefresh: false,
};
export const jewelryStore = create<TState & TActions>((set, get) => ({
	...initValues,

	reset: () => {
		set({ ...initValues });
	},

	setJewelry(data) {
		set({ jewelry: data });
	},
	setForceRefresh(data) {
		set({ forceRefresh: data });
	},
}));
