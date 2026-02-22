import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental : {
    serverActions : {
      allowedOrigins : ["humble-zebra-qj77g49w9wjc9p9p-3000.app.github.dev", "localhost:3000"],
    },
  },
};

export default nextConfig;
