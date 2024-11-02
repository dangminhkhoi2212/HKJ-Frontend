import { Spin } from "antd";

import { Logo } from "@/shared/Logo";

const LoadingIntro = () => {
	return (
		<div className="h-screen w-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-gray-300 flex flex-col justify-center items-center gap-6 text-center">
			<Logo
				allowClick={false}
				className="h-24 w-60 px-7 shadow-lg"
				classNameImage="px-10"
			/>
			<span className="text-lg text-gray-600 font-medium m-0">
				Bạn đang sử dụng dịch vụ của HKJ
			</span>
			<span className="text-sm text-gray-700 font-light">
				Vui lòng chờ một chút để trải nghiệm tốt hơn
			</span>
			<Spin size="large" className="text-gold-500" />
		</div>
	);
};

export default LoadingIntro;
