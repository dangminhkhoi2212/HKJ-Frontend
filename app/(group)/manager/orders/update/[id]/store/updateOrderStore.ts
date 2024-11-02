import { create } from "zustand";

import { TOrder } from "@/types";

type TState = {
	step: number;
	maxStep: number;
	order: TOrder | null;
};
type TActions = {
	reset: () => void;
	next: () => void;
	prev: () => void;
	setOrder: (data: TOrder | null) => void;
};

const initValues: TState = {
	step: 0,
	maxStep: 2,
	order: null,
};
export const updateOrderStore = create<TState & TActions>((set, get) => ({
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

	setOrder(data) {
		set({ order: data });
	},
}));
