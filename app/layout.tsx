import "antd/dist/reset.css";
import "./globals.css";

import { getServerSession } from "next-auth";
import { Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import ReactQueryProvider from "@/providers/QueryClientProvider";
import SessionProvoider from "@/providers/SessionProvider";
import { LayoutConfig } from "@/shared/LayoutConfig";
import { Security } from "@/shared/Security";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import type { Metadata } from "next";
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
}: {
  children: React.ReactNode;
}) {
  const session: any = getServerSession();
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        <SessionProvoider session={session}>
          <ReactQueryProvider>
            <LayoutConfig>
              <AntdRegistry>
                <Security>
                  <NextTopLoader showSpinner={false} />
                  {children}
                </Security>
              </AntdRegistry>
            </LayoutConfig>
          </ReactQueryProvider>
        </SessionProvoider>
      </body>
    </html>
  );
}
