import { Tabs } from 'antd';
import React from 'react';

import HireEmployeeForm from './HireEmployeeForm';
import HireList from './HireList';

type Props = {};
let tabs = [
	{
		label: `Tạo hồ sơ`,
		key: "1",
		children: <HireEmployeeForm />,
	},
	{
		label: `Danh sách`,
		key: "2",
		children: <HireList />,
	},
];
const TabHire: React.FC<Props> = ({}) => {
	return <Tabs items={tabs} />;
};

export default TabHire;
