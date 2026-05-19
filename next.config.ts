import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/uploads/:filename",
          destination: "/api/files/:filename",
        },
      ],
    };
  },
};

export default nextConfig;
