import { create } from "zustand";

type TState = {
	quantity: number;
	forceRefresh: boolean;
};
type TActions = {
	reset: () => void;
	setQuantity: (data: number) => void;
	setForceRefresh: (data: boolean) => void;
};

const initValues: TState = {
	quantity: 0,
	forceRefresh: false,
};
export const cartStore = create<TState & TActions>((set, get) => ({
	...initValues,

	reset: () => {
		set({ ...initValues });
	},

	setQuantity(data) {
		set({ quantity: data });
	},
	setForceRefresh(data) {
		set({ forceRefresh: data });
	},
}));
