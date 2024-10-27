import { create } from "zustand";

type TState = {
	file: File | null;
};
type TActions = {
	setFile: (file: File | null) => void;
};
export const imageSearchAIStore = create<TState & TActions>((set, get) => ({
	file: null,
	setFile: (file: File | null) => set({ file }),
}));
