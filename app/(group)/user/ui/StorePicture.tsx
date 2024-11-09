import Image from "next/image";
import React from "react";

import sp1 from "@/public/images/StorePicture/sp1.jpg";
import sp2 from "@/public/images/StorePicture/sp2.jpg";
import sp3 from "@/public/images/StorePicture/sp3.jpg";
import sp4 from "@/public/images/StorePicture/sp4.jpg";
import sp5 from "@/public/images/StorePicture/sp5.jpg";

type Props = {};

const StorePicture: React.FC<Props> = ({}) => {
	return (
		<div className="flex flex-col justify-center items-center gap-4 overflow-auto">
			<div className="flex flex-col justify-center items-center">
				<p className="text-2xl font-semibold">HÌNH ẢNH CỬA HÀNG</p>
				<p className="italic text-lg font-light">
					“Nơi bắt đầu những ý tưởng và trưng bày sản phẩm mới của
					HKJ.”
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 max-h-96 place-items-stretch gap-4 w-full">
				<div className="col-span-1 row-span-2">
					<Image
						src={sp1}
						alt="sp1"
						className="object-cover h-full w-full rounded-lg"
					/>
				</div>
				<div className="col-span-1 row-span-2 grid grid-cols-2 grid-rows-2 gap-4">
					{/* <div className=" row-span-1 grid grid-cols-2  gap-4"> */}
					<Image
						src={sp2}
						alt="sp2"
						className="object-cover h-full w-full rounded-lg"
					/>
					<Image
						src={sp3}
						alt="sp2"
						className="object-cover h-full w-full rounded-lg"
					/>
					{/* </div>
					<div className=" row-span-1 grid grid-cols-2  gap-4"> */}
					<Image
						src={sp4}
						alt="sp2"
						className="object-cover h-full w-full rounded-lg"
					/>
					<Image
						src={sp5}
						alt="sp2"
						className="object-cover h-full w-full rounded-lg"
					/>
					{/* </div> */}
				</div>
			</div>
		</div>
	);
};

export default StorePicture;
