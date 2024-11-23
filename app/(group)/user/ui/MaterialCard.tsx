import Image from "next/image";
import Link from "next/link";
import React from "react";

import { routesUser } from "@/routes";
import { TMaterial } from "@/types";

type Props = { material: TMaterial };

const MaterialCard: React.FC<Props> = ({ material }) => {
	return (
		<Link href={`${routesUser.product}?materialId=${material.id}`}>
			<div className="flex flex-col gap-2 justify-center items-center  rounded-lg hover:transition-all hover:duration-300  hover:shadow-md overflow-hidden p-2 ">
				<div className="relative size-48 ">
					<Image
						alt={material.name}
						src={material.coverImage}
						className="rounded-lg object-cover absolute"
						fill
						sizes="150px"
					/>
				</div>
				<p className="font-semibold text-gray-800">{material.name}</p>
			</div>
		</Link>
	);
};

export default MaterialCard;
