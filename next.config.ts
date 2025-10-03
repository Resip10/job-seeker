import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Exclude functions directory from Next.js build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'firebase-functions': 'firebase-functions',
        'firebase-admin': 'firebase-admin',
      });
    }

    return config;
  },
};

export default nextConfig;
