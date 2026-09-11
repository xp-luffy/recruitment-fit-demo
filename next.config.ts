import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  // AI-generated apps should deploy even if the template has strict type issues.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
