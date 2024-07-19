import { Button } from "antd";
import Image from "next/image";
import logo from "@/public/images/ring-logo.svg";

export default function Home() {
  return (
    <main className="">
      <div className="w-20 h-10 flex items-center justify-center">
        <Image
          src={logo}
          alt="logo"
          className="object-contain"
          height={24}
          width={24}
        />
        <p>HKJ</p>
      </div>
    </main>
  );
}
