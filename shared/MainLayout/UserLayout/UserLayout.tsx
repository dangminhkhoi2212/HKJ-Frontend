import { Layout } from 'antd';
import React from 'react';

import { UserContent } from './Content';
import { Footer } from './Footer';
import { UserHeader } from './Header';

type Props = { children: React.ReactNode };
const UserLayout: React.FC<Props> = ({ children }) => {
	return (
		<Layout className="h-screen w-screen bg-white">
			<UserHeader />

			<UserContent>
				{children}

				<Footer />
			</UserContent>
		</Layout>
	);
};

export default UserLayout;
