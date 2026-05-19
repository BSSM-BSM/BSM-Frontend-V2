/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
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
  reactStrictMode: true
};

module.exports = nextConfig;
