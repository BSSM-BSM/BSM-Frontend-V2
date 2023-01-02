/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bssm.kro.kr', 'auth.bssm.kro.kr']
  },
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    images: {
      allowFutureImage: true
    },
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