import React from 'react';

import { Frame } from '@/shared/Frame';

import { StatisticDashBoard } from '../ui';

type Props = {};

const ManagerPage: React.FC<Props> = ({}) => {
	return (
		<Frame title="Thống kê">
			<StatisticDashBoard />
		</Frame>
	);
};

export default ManagerPage;
