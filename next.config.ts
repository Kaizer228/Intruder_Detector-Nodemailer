import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // other Next.js config options go here

  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      },
    };

    return config;
  },
};

export default nextConfig;
