import type { NextConfig } from 'next';
import packageJson from './package.json';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
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
