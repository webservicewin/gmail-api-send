/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Configure SWC directly
    styledComponents: false,
    // Disable JSX namespace check
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  }
};

export default nextConfig;

