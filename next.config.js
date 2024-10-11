/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'auth.bssm.app'
      }
    ],
    minimumCacheTTL: 60
  },
  reactStrictMode: false,
  swcMinify: true
};

module.exports = nextConfig;
