import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable the experimental instrumentation hook
    instrumentationHook: true
  }
};

export default nextConfig;
