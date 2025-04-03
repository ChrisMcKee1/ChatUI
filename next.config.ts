import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable the experimental instrumentation hook
    instrumentationHook: true
  } as any,
  
  // Output static HTML files for Azure Static Web Apps
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
  }
};

export default nextConfig;
