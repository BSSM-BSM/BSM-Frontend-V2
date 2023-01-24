/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['bssm.kro.kr', 'auth.bssm.kro.kr'],
    minimumCacheTTL: 60,
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
        destination: 'https://bssm.kro.kr/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig