/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Cover image uploads are sent through a server action.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
