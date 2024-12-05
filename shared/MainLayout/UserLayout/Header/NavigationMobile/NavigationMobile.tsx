import { Button, Drawer } from "antd";
import { Menu } from "lucide-react";
import React, { useState } from "react";

import { Logo } from "@/shared/Logo";

import { UserNavigate } from "../Navigate";

type Props = {};

const NavigationMobile: React.FC<Props> = ({}) => {
	const [open, setOpen] = useState<boolean>(false);
	const onClose = () => {
		setOpen(false);
	};
	return (
		<div className="md:hidden">
			<Button
				icon={<Menu size={14} />}
				onClick={() => setOpen(true)}
			></Button>
			<Drawer
				title={<Logo />}
				placement={"left"}
				closable={false}
				onClose={onClose}
				onClick={onClose}
				open={open}
				key={"left"}
			>
				<UserNavigate mode="inline" />
			</Drawer>
		</div>
	);
};

export default NavigationMobile;
