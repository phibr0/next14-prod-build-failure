/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: !process.env.DISABLE_SWC_MINIFY,
};

module.exports = nextConfig;
