/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // For Docker usage
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};
export default nextConfig;
