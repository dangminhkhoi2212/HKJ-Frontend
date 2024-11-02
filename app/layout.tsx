import './globals.css';

import { getServerSession } from 'next-auth';
import { Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { authOptions } from '@/config';
import { QueryClientProvider, SessionProvider } from '@/providers';
import { ZustandProvider } from '@/providers/ZustandProvider';
import { LayoutConfig } from '@/shared/LayoutConfig';
import { Security } from '@/shared/Security';
import { cn } from '@/utils';
import { AntdRegistry } from '@ant-design/nextjs-registry';

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
	const session: any = getServerSession(authOptions);
	return (
		<html lang="en">
			<body className={cn(roboto.className, "bg-slate-50")}>
				<NextTopLoader showSpinner={false} />
				<QueryClientProvider>
					<LayoutConfig>
						<AntdRegistry>
							<SessionProvider
								session={session}
								refetchInterval={5 * 60}
							>
								<ZustandProvider>
									<Security>{children}</Security>
								</ZustandProvider>
							</SessionProvider>
						</AntdRegistry>
					</LayoutConfig>
				</QueryClientProvider>
			</body>
		</html>
	);
}
