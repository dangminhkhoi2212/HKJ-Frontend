"use client";
import { Carousel } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import Banner1 from "@/public/images/banner/banner1.jpg";
import Banner2 from "@/public/images/banner/banner2.jpg";
import Banner3 from "@/public/images/banner/banner3.jpg";
import Banner4 from "@/public/images/banner/banner4.jpg";
import { routesUser } from "@/routes";

import type { CarouselProps, RadioChangeEvent } from "antd";
type DotPosition = CarouselProps["dotPosition"];

const contentStyle: React.CSSProperties = {
	height: "160px",
	color: "#fff",
	lineHeight: "160px",
	textAlign: "center",
	background: "#364d79",
};
const items = [
	{ key: "4", src: Banner4, link: `${routesUser.product}?categoryId=11203` },
	{ key: "1", src: Banner1, link: `${routesUser.product}?categoryId=11212` },
	{ key: "2", src: Banner2, link: `${routesUser.product}?categoryId=11207` },
	{ key: "3", src: Banner3, link: `${routesUser.product}?categoryId=11208` },
];
const App: React.FC = () => {
	const [dotPosition, setDotPosition] = useState<DotPosition>("top");
	const router = useRouter();
	const handlePositionChange = ({ target: { value } }: RadioChangeEvent) => {
		setDotPosition(value);
	};

	return (
		<Carousel
			arrows
			dotPosition="right"
			className="rounded-lg overflow-hidden h-96 relative"
		>
			{items.map((item) => (
				<Image
					src={item.src}
					alt={item.key}
					key={item.key}
					priority
					className=" object-cover h-96 cursor-pointer"
					onClick={() => router.push(item.link)}
				/>
			))}
		</Carousel>
	);
};

export default App;
