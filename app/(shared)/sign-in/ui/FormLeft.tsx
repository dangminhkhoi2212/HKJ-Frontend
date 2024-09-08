import Image from "next/image";
import SignInIntroImg from "@/public/images/sign-in-intro.svg";
const FormLeft = () => {
  return (
    <div className="hidden md:flex col-span-1   flex-col justify-center items-center gap-5 md:p-3 lg:p-5 xl:p-14 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          Trở thành khách hàng của HKJ để nhận thêm nhiều ưu đãi
        </h1>
        <p className="text-sm italic">
          Cùng nhau khám phá sự tinh tế trong phong cách mà bạn chọn. Tạo ra sự
          khác biệt cho trang sức của cá nhân bạn.
        </p>
      </div>
      <div className="w-60 h-60 relative drop-shadow-lg">
        <Image src={SignInIntroImg} alt="intro" priority />
      </div>
    </div>
  );
};

export default FormLeft;
