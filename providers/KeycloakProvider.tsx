"use client";
import cookiejs from 'js-cookie';
import Keycloak, { KeycloakOnLoad } from 'keycloak-js';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import axiosInterceptor from '@/config/axiosInterceptor';
import { routes } from '@/routes';
import { accountService } from '@/services';

// Define the types for the AuthContext
interface AuthContextType {
	keycloak: Keycloak | null;
	authenticated: boolean;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
	children: ReactNode;
}

// Initialize the context with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
	const [authenticated, setAuthenticated] = useState<boolean>(false);

	const router = useRouter();
	const getAccountApi = async () => {
		try {
			const account = await accountService.getAccount();
			cookiejs.set("account", JSON.stringify(account));
		} catch (error) {
			return null;
		}
	};
	useEffect(() => {
		const initOptions = {
			url: process.env.NEXT_PUBLIC_KEYCLOAK_URL as string,
			realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM as string,
			clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string,
			onLoad: "login-required" as KeycloakOnLoad,
			checkLoginIframe: true,
			pkceMethod: "S256",
		};

		const kc = new Keycloak(initOptions);

		kc.init({ onLoad: initOptions.onLoad })
			.then((auth) => {
				if (!auth) router.push(routes.signIn);
				else {
					setKeycloak(kc);
					setAuthenticated(true);
					axiosInterceptor().defaults.headers.common[
						"Authorization"
					] = `Bearer ${kc.token}`;

					kc.onTokenExpired = () => {
						kc.updateToken(30).catch(() => {
							console.error("Failed to refresh token");
						});
					};
				}
			})
			.catch(() => console.error("Authentication Failed"));

		if (kc.authenticated) {
			getAccountApi();
		}
	}, []);

	return (
		<AuthContext.Provider value={{ keycloak, authenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to access the AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
