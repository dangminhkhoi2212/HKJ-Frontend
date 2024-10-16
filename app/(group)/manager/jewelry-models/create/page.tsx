import { Frame } from '@/shared/Frame';

import { CreateJewelryForm } from './ui';

type Props = {};
const CreateJeweleryModalPage: React.FC<Props> = () => {
	return (
		<Frame title="Thêm trang sức mới">
			<CreateJewelryForm />
		</Frame>
	);
};

export default CreateJeweleryModalPage;
