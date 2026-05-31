import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @zxing/browser ships CJS and needs bundling by Next.js
  transpilePackages: ["@zxing/browser", "@zxing/library"],
  eslint: {
    // Lint errors won't block production builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.openfoodfacts.org" },
      { protocol: "https", hostname: "static.openfoodfacts.org" },
    ],
  },
};

export default nextConfig;
