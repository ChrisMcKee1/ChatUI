import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Instrumentation hook is enabled by default via instrumentation.ts
    // Removed: instrumentationHook: true
  } as any,
  
  // Use standalone output mode to support server features like rewrites
  output: 'standalone',
  
  // Configure image optimization
  images: {
    // unoptimized: true, // No longer needed unless exporting to static HTML
  },
  
  // Disable trailing slashes for Azure Static Web Apps
  trailingSlash: false,
  
  // Properly handle the staticwebapp.config.json
  // This ensures the file is copied to the output directory
  async rewrites() {
    return [];
  },

  // Ignore ESLint errors during build
  eslint: {
    // ESLint errors and warnings won't stop the build
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
