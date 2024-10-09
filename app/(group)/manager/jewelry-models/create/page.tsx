"use client";
import { useEffect } from "react";
import * as yup from "yup";

import { Frame } from "@/shared/Frame";
import jewelryValidation from "@/validations/jewelryValidation";

import { createJewelryStore } from "./store";
import { CreateJewelryForm } from "./ui";

const schema = jewelryValidation.jewelrySchema.omit(["id"]);
type Props = {};

export type TFormJewelry = yup.InferType<
	yup.ObjectSchema<typeof schema>
>["__outputType"];
const initValue: TFormJewelry = {
	name: "",
	wieght: 0,
	color: "",
	active: true,
	isCustom: false,
	price: 0,
	coverImage: [],
	images: [],
	description: "",
	category: { id: 0 },
	manager: { id: 0 },
	project: { id: 0 },
};
const CreateJeweleryModalPage: React.FC<Props> = () => {
	const { reset } = createJewelryStore();

	//   const {
	//     data,
	//     mutate: createJewelry,
	//     isLoading,
	//   } = useMutation({
	//     mutationFn: (data: TFormJewelry) => {
	//       const dataConvert: TJewelryCreate = {
	//         ...data,
	//         coverImage: data.coverImage[0]?.url,
	//       };
	//       return jewelryService.create(dataConvert);
	//     },
	//     onSuccess(data, variables, context) {
	//       message.success("Đã tạo bảng bảng mẫu này");
	//     },
	//   });
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	return (
		<Frame title="Thêm trang sức mới">
			<CreateJewelryForm />
		</Frame>
	);
};

export default CreateJeweleryModalPage;
