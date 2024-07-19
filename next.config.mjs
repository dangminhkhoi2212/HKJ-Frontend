/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "product.hstatic.net",
      },
    ],
  },
};

export default nextConfig;
