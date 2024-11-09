import { Divider } from 'antd';
import Link from 'next/link';
import React from 'react';

import { QUERY_CONST } from '@/const';
import { keyCloakService } from '@/services';
import { Frame } from '@/shared/Frame';
import queryClientUtil from '@/utils/queryClientUtil';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import AccountList from './ui/AccountList';
import TimeLineAccount from './ui/TimeLine';

const hydrate = async () => {
	const { defaultQuery } = QUERY_CONST;
	const queryClient = queryClientUtil.getQueryClient();

	await Promise.all([
		await queryClient.prefetchQuery({
			queryKey: ["keycloak-users-count"],
			queryFn: async () => {
				return await keyCloakService.getUsersCount(defaultQuery);
			},
		}),
		await queryClient.prefetchQuery({
			queryKey: ["keycloak-users", defaultQuery],
			queryFn: () => keyCloakService.getUsers(defaultQuery),
		}),
	]);

	return dehydrate(queryClient);
};
const AccountPage: React.FC<{}> = () => {
	return (
		<div className="flex flex-col gap-7">
			<Frame title="Hướng dãn đồng bộ tài khoản">
				<TimeLineAccount />
			</Frame>
			<Frame title="Quản lí tài khoản">
				<p>Sử dụng KeyCloak quản lí người dùng và phân quyền. </p>
				<Link
					target="_blank"
					href={process.env.NEXT_PUBLIC_KEYCLOAK_ADMIN || "/error"}
				>
					Mở KeyCloak
				</Link>
			</Frame>
			<div>
				<Divider />
				<HydrationBoundary state={hydrate()}>
					<AccountList />
				</HydrationBoundary>
			</div>
		</div>
	);
};

export default AccountPage;
