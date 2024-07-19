import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HKJ - Đặt trang sức",
  description: "Đặt trang sức trực tuyến",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
