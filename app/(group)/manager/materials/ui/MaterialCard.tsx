import { Button, Card } from "antd";
import { PenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { TMaterial } from "@/types";

const { Meta } = Card;
type Props = {
	data: TMaterial;
};
const MaterialCard: React.FC<Props> = ({ data }) => {
	const { router } = useRouterCustom();

	return (
		<Card
			className="overflow-hidden h-80 w-52 "
			key={data.id}
			cover={
				<Image
					alt="example"
					src={data.coverImage}
					sizes="200px"
					width={250}
					height={250}
					className="object-cover "
				/>
			}
			actions={[
				<Link
					key={data.id}
					href={routesManager.updateMaterial(data?.id!.toString())}
					className="flex justify-center items-center gap-2"
				>
					<Button icon={<PenIcon size={14} />} size="small"></Button>
				</Link>,
			]}
		>
			<Meta title={data.name} className="text-center" />
		</Card>
	);
};

export default MaterialCard;
