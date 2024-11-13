import { MapPinned, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Logo } from "@/shared/Logo";

type Props = {};
const Title: React.FC<{ title: string }> = ({ title }) => {
	return <p className="text-2xl font-bold">{title}</p>;
};
const Menu: React.FC<{}> = () => {
	const items = [
		{ name: "Trang chủ", link: "/" },
		{ name: "Cách làm sáng trang sức", link: "/" },
		{ name: "Cách bảo quản trang sức", link: "/" },
		{ name: "Vàng và những điều cần biết", link: "/" },
		{ name: "Đá quý và những điều cần biết", link: "/" },
		{ name: "Giới thiệu", link: "/" },
	];
	return (
		<>
			<Title title="MENU" />
			<ul className="flex flex-col gap-2">
				{items.map((item) => (
					<li className="text-gray-700" key={item.name}>
						<Link href={item.link}>
							<span className="text-gray-700">{item.name}</span>
						</Link>
					</li>
				))}
			</ul>
		</>
	);
};
const Contact: React.FC<{}> = () => {
	return (
		<div className="flex flex-col items-start gap-4">
			<Title title="THÔNG TIN LIÊN HỆ" />
			<p className="flex gap-2">
				<MapPinned size={14} />
				Số 124/1, Đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Tp Cần
				Thơ
			</p>
			<p className="flex gap-2">
				<Phone size={14} />
				<a href="tel:123-456-7890">123-456-7890</a>
			</p>
		</div>
	);
};
const Footer: React.FC<Props> = ({}) => {
	return (
		<div className="bg-primary-950 w-full flex flex-col justify-center items-center ">
			<div className="flex-col flex md:flex-row justify-evenly gap-10 p-4 md:px-10 md:my-4">
				<div className="col-span-1 md:w-40 flex justify-center items-center flex-row md:flex-col">
					<Logo />
					<p className="font-semibold mt-2">
						Nâng tầm phong cách với trang sức thiết kế, thể hiện rõ
						sở thích và cá tính của bạn.
					</p>
				</div>
				<div className="col-span-1">
					<Menu></Menu>
				</div>
				<div className="col-span-1">
					<Contact />
				</div>
			</div>
		</div>
	);
};

export default Footer;
