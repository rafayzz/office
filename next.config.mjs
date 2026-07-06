/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
