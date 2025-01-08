import { jwtDecode } from "jwt-decode";
import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { AUTHORIZATIONS_CONST } from "@/const";
import { routes } from "@/routes";
import { encrypt } from "@/utils/encryption";

const AUTHORIZATIONS = AUTHORIZATIONS_CONST.AUTHORIZATIONS;
const convertReamlRoles = (roles: string[] | undefined) => {
	return Object.keys(AUTHORIZATIONS).filter((role) => roles?.includes(role));
};
// this will refresh an expired access token, when needed
async function refreshAccessToken(token: any) {
	const resp = await fetch(`${process.env.NEXT_PUBLIC_REFRESH_TOKEN_URL}`, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
			client_secret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET,
			grant_type: "refresh_token",
			refresh_token: token.refresh_token,
		} as Record<string, string>),
		method: "POST",
	});
	const refreshToken = await resp.json();
	if (!resp.ok) throw refreshToken;

	return {
		...token,
		access_token: refreshToken.access_token,
		decoded: jwtDecode(refreshToken.access_token),
		id_token: refreshToken.id_token,
		expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
		refresh_token: refreshToken.refresh_token,
	};
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		KeycloakProvider({
			clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
			clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET!,
			issuer: process.env.NEXT_PUBLIC_AUTH_ISSUER!,
		}),
	],

	callbacks: {
		async jwt({ token, account }: any) {
			const nowTimeStamp = Math.floor(Date.now() / 1000);

			if (account) {
				// account is only available the first time this callback is called on a new session (after the user signs in)
				token.decoded = jwtDecode(account.access_token);
				token.access_token = account.access_token;
				token.id_token = account.id_token;
				token.expires_at = account.expires_at;
				token.role = convertReamlRoles(
					token.decoded.realm_access.roles
				)[0];
				token.refresh_token = account.refresh_token;
				return token;
			}
			if (nowTimeStamp < token.expires_at) {
				// token has not expired yet, return it
				return token;
			} else {
				// token is expired, try to refresh it
				console.log("Token has expired. Will refresh...");
				try {
					const refreshedToken = await refreshAccessToken(token);
					console.log("Token is refreshed.");
					return refreshedToken;
				} catch (error) {
					console.error("Error refreshing access token", error);
					return { ...token, error: "RefreshAccessTokenError" };
				}
			}
		},
		async session({ session, token }: any) {
			// Send properties to the client
			session.access_token = token.access_token; // see utils/sessionTokenAccessor.js
			session.id_token = encrypt(token.id_token); // see utils/sessionTokenAccessor.js

			session.user.role = convertReamlRoles(
				token.decoded.realm_access.roles
			)[0];
			session.error = token.error;
			return session;
		},
	},
	pages: {
		signIn: routes.signIn,
	},
};
