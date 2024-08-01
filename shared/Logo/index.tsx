import Image from "next/image";
import logo from "@/public/images/logo.svg";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href={"/"}
      className={cn(
        " relative flex w-28 h-10  mx-3 items-center justify-center bg-white shadow-sm shadow-accent-500 rounded-md",
        className
      )}
    >
      <Image src={logo} alt="Logo HKJ" fill className="p-1 object-contain " />
    </Link>
  );
};

export default Logo;
