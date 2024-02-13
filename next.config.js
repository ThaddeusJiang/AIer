/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-tweet"],
  images: {
    domains: ["source.unsplash.com"]
  }
}

module.exports = nextConfig
