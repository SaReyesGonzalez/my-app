import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
    domains: [
      'www.queenonline.com',
      'cdn-images.dzcdn.net',
      'needle.cl',
      'robertopatxot.wordpress.com',
    ],
  }
};

export default nextConfig;
