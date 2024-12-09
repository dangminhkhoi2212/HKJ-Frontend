import { Descriptions } from "antd";
import React, { useId } from "react";
import { NumericFormat } from "react-number-format";

import NumberToWords from "@/shared/FormCustom/InputNumToWords/InputNumToWords";
import { THire } from "@/types/hireType";
import { formatUtil } from "@/utils";

import type { DescriptionsProps } from "antd";
type Props = {
	data: THire;
};
const HireDisplay: React.FC<Props> = ({ data }) => {
	const items: DescriptionsProps["items"] = [
		{
			key: useId(),
			label: "Họ Tên",
			children: `
          ${data?.employee?.user?.firstName} ${data?.employee?.user?.lastName}
       `,
			span: 1,
		},

		{
			key: useId(),
			label: "Email",
			children: data?.employee?.user?.email,
			span: 1,
		},
		{
			key: useId(),
			label: "Số điện thoại",
			children: data?.employee.phone,
			span: 1,
		},
		{
			key: useId(),
			label: "Ngày tạo tài khoản",
			children: formatUtil.formatDate(data?.employee.createdDate!),
			span: 1,
		},

		{
			key: useId(),
			label: "Địa chỉ",
			children: data?.employee.address || "Không tìm thấy",
			span: 2,
		},
		{
			key: useId(),
			label: "Vị trí làm việc",
			children: data?.position?.name,
			span: 2,
		},
		{
			key: useId(),
			label: "Mức lương làm việc",
			children: (
				<div className="flex flex-col gap-2">
					<NumericFormat
						value={data?.beginSalary}
						thousandSeparator=","
						suffix=" VND"
					/>
					<NumberToWords number={data?.beginSalary} />
				</div>
			),
			span: 2,
		},
		{
			key: useId(),
			label: "Ngày bắt đầu",
			children: formatUtil.formatDate(data?.beginDate, {
				removeTime: true,
			}),
			span: 1,
		},
		{
			key: useId(),
			label: "Ngày kết thúc ",
			children: formatUtil.formatDate(data?.endDate, {
				removeTime: true,
			}),
			span: 1,
		},
	];
	return (
		<Descriptions
			layout="vertical"
			bordered
			items={items}
			column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
		/>
	);
};

export default HireDisplay;
