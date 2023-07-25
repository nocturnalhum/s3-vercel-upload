/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'sketch-canvas-images.s3.ca-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'ca-central-1.s3.ca-central-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
