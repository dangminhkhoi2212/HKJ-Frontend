/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXTAUTH_URL:
			process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "product.hstatic.net",
			},
		],
	},
	async headers() {
		return [
			{
				// matching all API routes
				source: "/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Credentials", value: "true" }, // replace this your actual origin
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,DELETE,PATCH,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
					},
				],
			},
		];
	},
};

export default nextConfig;
