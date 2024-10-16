import { create } from "zustand";

import { TJewelry } from "@/types";

type TTypeForm = "add" | "update" | "delete" | null;
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

export const updateJewelryModelStore = create<TState & TActions>(
	(set, get) => ({
		...initValues,
		setJewelry: (value) => set({ jewelry: value }),

		reset: () => {
			set({ ...initValues });
		},
	})
);
