"use client";
import { Button } from "antd";
import { Plus } from "lucide-react";

import { useRouterCustom } from "@/hooks";
import { routesManager } from "@/routes";
import { Frame } from "@/shared/Frame";

import JewelryList from "./ui/JewelryList";

const JewelryModelPage: React.FC<{}> = () => {
	const { router } = useRouterCustom();
	return (
		<Frame
			title="Trang sức"
			buttons={
				<Button
					type="primary"
					icon={<Plus />}
					onClick={() => router.push(routesManager.createJewelry)}
				>
					Tạo mẫu trang sức
				</Button>
			}
		>
			<JewelryList />
		</Frame>
	);
};

export default JewelryModelPage;
