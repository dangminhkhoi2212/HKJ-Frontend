"use client";
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';
import React from 'react';

import { useAccountStore } from '@/providers';
import { TAccountInfo } from '@/types';
import { cn } from '@/utils/cn';

const AvatarAccount: React.FC<AvatarProps> = ({
	size = "large",
	children,
	...props
}) => {
	const account: TAccountInfo | null | undefined = useAccountStore(
		(state) => state.account
	);

	return (
		<Avatar
			className={cn(
				"align-middle bg-accent-700 font-medium",
				props.className
			)}
			size={size}
			{...props}
		>
			{children ? children : account?.lastName || "User"}
		</Avatar>
	);
};

export default AvatarAccount;
