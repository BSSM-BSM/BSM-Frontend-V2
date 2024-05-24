/** @type {import('next').NextConfig} */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RESOURCE_BASE_URL = process.env.NEXT_PUBLIC_RESOURCE_BASE_URL;

const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['auth.bssm.app'],
    minimumCacheTTL: 60
  },
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    appDir: true
  },
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE_URL}/:path*`
      },
      {
        source: '/resource/:path*',
        destination: `${RESOURCE_BASE_URL}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
