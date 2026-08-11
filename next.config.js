// Destination: next.config.js
// This replaces the earlier version.

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // job descriptions can be long
    },
    // mammoth is CJS-heavy and safer excluded from webpack bundling too
    serverComponentsExternalPackages: ["mammoth"],
  },
};

module.exports = nextConfig;