import { Button } from "antd";
import Image from "next/image";
import logo from "@/public/images/ring-logo.svg";
import Logo from "@/shares/Logo";

export default function Home() {
  return (
    <main className="flex gap-2">
      <Logo />
      <p className="text-red-500 ring w-20">main</p>
    </main>
  );
}
