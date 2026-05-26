import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.fotmob.com",
        pathname: "/image_resources/playerimages/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "sports.bzzoiro.com",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
