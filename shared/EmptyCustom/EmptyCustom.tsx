import { Empty, EmptyProps } from 'antd';
import React from 'react';

type Props = EmptyProps;

const EmptyCustom: React.FC<Props> = ({ ...props }) => {
	return <Empty {...props} description="Không có dữ liệu" />;
};

export default EmptyCustom;
