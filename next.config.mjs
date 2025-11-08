/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // For Docker usage
  eslint: {
    // Disable ESLint during builds (warnings won't fail the build)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: Also ignore TypeScript errors during builds if needed
    // ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};
export default nextConfig;
