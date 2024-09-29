import Image from "next/image";
import Link from "next/link";

import logo from "@/public/images/logo.svg";
import { cn } from "@/utils/cn";

type Props = {
  allowClick?: boolean;
  className?: string;
  classNameImage?: string;
};
const Logo: React.FC<Props> = ({
  allowClick = true,
  className,
  classNameImage,
}) => {
  if (!allowClick) {
  }
  return (
    <div>
      <Link
        href={"/"}
        className={cn(
          " relative flex w-28 h-10  mx-3 items-center justify-center bg-white shadow-sm shadow-accent-500 rounded-md",
          className,
          allowClick ? "" : "pointer-events-none"
        )}
      >
        <Image
          src={logo}
          alt="Logo HKJ"
          fill
          className={cn("p-1 object-contain", classNameImage)}
        />
      </Link>
    </div>
  );
};

export default Logo;
