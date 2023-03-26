/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["react-tweet"],
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
