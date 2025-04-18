/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['placeholder.com'],
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
