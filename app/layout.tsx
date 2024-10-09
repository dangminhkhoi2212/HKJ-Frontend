import "antd/dist/reset.css";
import "./globals.css";

import { getServerSession } from "next-auth";
import { Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

import ReactQueryProvider from "@/providers/QueryClientProvider";
import SessionProvoider from "@/providers/SessionProvider";
import { LayoutConfig } from "@/shared/LayoutConfig";
import { Security } from "@/shared/Security";
import { cn } from "@/utils";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import Loading from "./loading";

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
			<body
				className={cn(roboto.className, "bg-slate-50")}
				suppressHydrationWarning={true}
			>
				<NextTopLoader showSpinner={false} />
				<SessionProvoider session={session}>
					<ReactQueryProvider>
						<LayoutConfig>
							<AntdRegistry>
								<Suspense fallback={<Loading />}>
									<Security>{children}</Security>
								</Suspense>
							</AntdRegistry>
						</LayoutConfig>
					</ReactQueryProvider>
				</SessionProvoider>
			</body>
		</html>
	);
}
