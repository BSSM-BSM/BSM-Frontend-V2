/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['test.bssm.kro.kr', 'auth.bssm.kro.kr']
    },
    reactStrictMode: true,
    swcMinify: true,
    rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*'
            }
        ]
    }
}

module.exports = nextConfig