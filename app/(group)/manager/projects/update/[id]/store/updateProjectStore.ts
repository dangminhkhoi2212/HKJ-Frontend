import { Task } from "gantt-task-react";
import { create } from "zustand";

import { TProject, TTask } from "@/types";

type TState = {
	projectId?: number | null;
	project: TProject | null;
	tab?: number | null;
	isLoading: boolean;
	showCreateTask: boolean;
	showUpdateTask: TUpdateTask;
	tasks: Task[];
};
type TUpdateTask = {
	show: boolean;
	task: TTask | null;
};
type TActions = {
	reset: () => void;
	setProject: (data: TProject | null) => void;
	setProjectId: (data: number | null) => void;
	setTab: (data: number | null) => void;
	setIsLoading: (data: boolean) => void;
	setShowCreateTask: (data: boolean) => void;
	setShowUpdateTask: (data: TUpdateTask) => void;
	setTasks: (data: Task[]) => void;
	addTask: (data: Task) => void;
};

const initValues: TState = {
	tab: 1,
	projectId: null,
	project: null,
	isLoading: true,
	showCreateTask: false,
	showUpdateTask: {
		show: false,
		task: null,
	},
	tasks: [],
};
export const updateProjectStore = create<TState & TActions>((set, get) => ({
	...initValues,
	reset: () => {
		set({ ...initValues });
	},
	setProjectId(data) {
		set({ projectId: data });
	},
	setTab(data) {
		set({ tab: data });
	},
	setProject(data) {
		set({ project: data });
	},
	setIsLoading(data) {
		set({ isLoading: data });
	},
	setShowCreateTask(data) {
		set({ showCreateTask: data });
	},
	setShowUpdateTask(data) {
		set({ showUpdateTask: data });
	},
	addTask(data: Task) {
		set({ tasks: [...get().tasks, { ...data }] });
	},
	setTasks(data) {
		set({ tasks: data });
	},
}));
