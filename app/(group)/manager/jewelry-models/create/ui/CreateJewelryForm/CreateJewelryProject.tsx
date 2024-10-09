import { Form, Tag } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import jewelryValidation from "@/validations/jewelryValidation";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = jewelryValidation.jewelrySchema.pick(["project"]);
type TForm = yup.InferType<yup.ObjectSchema<typeof schema>>["__outputType"];

const intiValue: TForm = {
	project: { id: 0 },
};
const CreateJewelryProject: React.FC<{}> = () => {
	const {
		handleSubmit,
		formState: { errors },
	} = useForm<TForm>({
		defaultValues: intiValue,
		resolver: yupResolver(schema),
	});
	return (
		<Form>
			<Tag color="blue" className="text-wrap">
				Thêm một dự án để xem quy trình sản xuât của mặt hàng trang sức
				này
			</Tag>
		</Form>
	);
};

export default CreateJewelryProject;
