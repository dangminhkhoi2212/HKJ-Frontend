import Image from "next/image";
import logo from "@/public/images/logo.svg";
import Link from "next/link";
import { cn } from "@/utils/cn";

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Link
      href={"/"}
      className={cn(
        "flex items-center justify-center bg-white px-3 shadow-sm shadow-accent-500 rounded-md",
        className
      )}
    >
      <div className="relative w-full h-10   py-5">
        <Image
          src={logo}
          alt="Logo HKJ"
          layout="fill"
          objectFit="contain"
          className="py-2 px-1"
        />
      </div>
    </Link>
  );
};

export default Logo;
