import { create } from "zustand";

import { TJewelry } from "@/types";

type TState = {
	jewelry: TJewelry | null;
};
const initValues: TState = {
	jewelry: null,
};
type TActions = {
	setJewelry: (value: TJewelry | null) => void;
	reset: () => void;
};

export const productDetailStore = create<TState & TActions>((set, get) => ({
	...initValues,
	setJewelry(value) {
		set({ jewelry: value });
	},

	reset: () => {
		set({ ...initValues });
	},
}));
