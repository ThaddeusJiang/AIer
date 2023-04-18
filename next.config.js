/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-tweet"],
  experimental: {
    appDir: true
  },
  images: {
    domains: ["source.unsplash.com"]
  }
}

module.exports = nextConfig
