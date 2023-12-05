/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  mode: 'production',
  reloadOnOnline: false,
});

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
module.exports = nextConfig;
