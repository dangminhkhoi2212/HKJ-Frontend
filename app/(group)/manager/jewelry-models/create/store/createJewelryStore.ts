import { create } from "zustand";

import { TJewelry } from "@/types/jewelryType";

type TState = {
	step: number;
	maxStep: number;
	jewelry: TJewelry | null;
};
type TActions = {
	reset: () => void;
	next: () => void;
	prev: () => void;
	setJewelry: (data: TJewelry | null) => void;
};

const initValues: TState = {
	step: 0,
	maxStep: 3,
	jewelry: null,
};
export const createJewelryStore = create<TState & TActions>((set, get) => ({
	...initValues,
	next: () => {
		const { step, maxStep } = get();
		if (step < maxStep) {
			set({ step: step + 1 });
		}
	},

	prev: () => {
		const { step } = get();
		if (step > 0) {
			set({ step: step - 1 });
		}
	},

	reset: () => {
		set({ ...initValues });
	},

	setJewelry(data) {
		set({ jewelry: data });
	},
}));
