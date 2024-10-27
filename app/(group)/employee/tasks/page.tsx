import { cookies } from 'next/headers'; // For App Router in Next.js 13
import React from 'react';

import { KEY_CONST, QUERY_CONST } from '@/const';
import taskService from '@/services/taskService';
import { EmptyCustom } from '@/shared/EmptyCustom';
import { Frame } from '@/shared/Frame';
import { TQuery, TTaskQuery } from '@/types';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { TaskList } from './ui';

const { ACCOUNT_ID_COOKIE } = KEY_CONST;
type Props = {};
const hydrate = async (query: TQuery<TTaskQuery>) => {
	const queryClient = queryClientUtil.getQueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["tasks", query], // Pass the query state as part of the key
			queryFn: () => taskService.get(query),
		}),
		queryClient.prefetchQuery({
			queryKey: ["tasks-count", query], // Use the same query object for count
			queryFn: () => taskService.getCount(query),
		}),
	]);

	return dehydrate(queryClient);
};
const TasksPage: React.FC<Props> = async ({}) => {
	const accountIDCookie = cookies().get(ACCOUNT_ID_COOKIE)?.value;
	const accountID = accountIDCookie
		? Number.parseInt(accountIDCookie)
		: undefined;
	const { defaultQuery } = QUERY_CONST;

	const newQuery: TQuery<TTaskQuery> = {
		...defaultQuery,
		employee: { id: accountID! },
	};
	const state = await hydrate(newQuery);
	console.log("🚀 ~ constTasksPage:React.FC<Props>= ~ state:", state);
	return (
		<Frame title="Công việc">
			{!accountID ? (
				<EmptyCustom />
			) : (
				<HydrationBoundary state={state}>
					<TaskList query={newQuery} />
				</HydrationBoundary>
			)}
		</Frame>
	);
};

export default TasksPage;
