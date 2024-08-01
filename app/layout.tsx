import type { Metadata } from "next";
import "./globals.css";
import "antd/dist/reset.css";
import { Roboto } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import LayoutConfig from "@/shared/LayoutConfig";
import NextTopLoader from "nextjs-toploader";
import Security from "@/shared/Security";
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
        <NextTopLoader showSpinner={false} />
        <AntdRegistry>
          <LayoutConfig>
            <Security>{children}</Security>
          </LayoutConfig>
        </AntdRegistry>
      </body>
    </html>
  );
}
