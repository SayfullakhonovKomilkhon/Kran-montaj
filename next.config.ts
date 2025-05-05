import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for Vercel deployment
  images: {
    domains: [], // Add any external domains if needed
    unoptimized: process.env.NODE_ENV === 'development', // Don't optimize during development
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images in production
      },
    ],
  },
};

export default nextConfig;
