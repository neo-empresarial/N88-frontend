/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://n88-backend-git-development-neos-projects-cd039f7e.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;

