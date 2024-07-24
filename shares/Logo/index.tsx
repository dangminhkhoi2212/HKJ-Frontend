import Image from "next/image";
import logo from "@/public/images/logo.svg";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href={"/"}
      className={cn(
        " relative flex w-28 h-10 py-2 px-3 items-center justify-center bg-white shadow-sm shadow-accent-500 rounded-md",
        className
      )}
    >
      {/* <div className=" relative w-full h-20 aspect-video"> */}
      <Image src={logo} alt="Logo HKJ" fill className="p-1 object-contain" />
      {/* </div> */}
    </Link>
  );
};

export default Logo;
