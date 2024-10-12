import { create } from "zustand";

import { TProject } from "@/types";

type TState = {
	step: number;
	maxStep: number;
	project: TProject | null;
};
type TActions = {
	reset: () => void;
	next: () => void;
	prev: () => void;
	setProject: (data: TProject | null) => void;
};

const initValues: TState = {
	step: 1,
	maxStep: 3,
	project: null,
};
export const createProjectStore = create<TState & TActions>((set, get) => ({
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

	setProject(data) {
		set({ project: data });
	},
}));
