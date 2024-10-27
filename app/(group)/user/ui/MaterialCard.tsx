import { Image } from "antd";
import React from "react";

import { TMaterial } from "@/types";

type Props = { material: TMaterial };

const MaterialCard: React.FC<Props> = ({ material }) => {
	return (
		<Image
			src={material.coverImage}
			preview={false}
			className="h-full w-full rounded-lg"
		/>
	);
};

export default MaterialCard;
