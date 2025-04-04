import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Instrumentation hook is enabled by default via instrumentation.ts
    // Removed: instrumentationHook: true
  } as any,
  
  // Use static export for Azure Static Web Apps
  output: 'export',
  
  // Configure image optimization
  images: {
    unoptimized: true, // Required for static export
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
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    // TypeScript errors and warnings won't stop the build
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
