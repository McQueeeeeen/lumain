import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.static.com',
      },
      {
        protocol: 'https',
        hostname: '**.lumain.kz',
      },
      {
        protocol: 'https',
        hostname: '**.haydi.kz',
      },
    ],
  },
};

export default nextConfig;
