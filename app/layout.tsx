import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LayoutConfig from "@/shares/LayoutConfig";
import NextTopLoader from "nextjs-toploader";
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HKJ - Đặt trang sức",
  description: "Đặt trang sức trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <NextTopLoader />
        <AntdRegistry>
          <LayoutConfig>{children}</LayoutConfig>
        </AntdRegistry>
      </body>
    </html>
  );
}
