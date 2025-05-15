import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Use static export for Azure Static Web Apps
  output: 'export',
  
  // Configure image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Disable trailing slashes for Azure Static Web Apps
  trailingSlash: false,
  
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
