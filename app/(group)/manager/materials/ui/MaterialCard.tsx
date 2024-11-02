import { Card, Image, Skeleton } from 'antd';
import Link from 'next/link';
import React from 'react';

import { useRouterCustom } from '@/hooks';
import { routesManager } from '@/routes';
import { TMaterial } from '@/types';
import { EditOutlined } from '@ant-design/icons';

const { Meta } = Card;
type Props = {
	data: TMaterial;
};
const MaterialCard: React.FC<Props> = ({ data }) => {
	const { router } = useRouterCustom();

	return (
		<Card
			className="overflow-hidden w-full min-w-40 min-h-28 max-w-60 "
			key={data.id}
			cover={
				<Image
					alt="example"
					src={data.coverImage}
					preview={false}
					placeholder={
						<Skeleton.Image
							active={true}
							className="w-full h-full"
						/>
					}
					className="min-h-full "
				/>
			}
			actions={[
				<Link
					key={data.id}
					href={routesManager.updateMaterial(data?.id!.toString())}
					className="flex justify-center items-center"
				>
					<EditOutlined key="edit" />
				</Link>,
			]}
		>
			<Meta title={data.name} />
		</Card>
	);
};

export default MaterialCard;
