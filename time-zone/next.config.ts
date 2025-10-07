import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/time-zone',
  assetPrefix: '/time-zone/',
  images: {
    unoptimized: true, // Required for next export + GitHub Pages
  },
};

export default withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);