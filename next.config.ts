import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.epicgames.com' },
      { hostname: '*.akamaized.net' },
      { hostname: 'cdn.akamai.steamstatic.com' },
      { hostname: 'shared.akamai.steamstatic.com' },
      { hostname: 'cdn.cloudflare.steamstatic.com' },
      { hostname: 'store.cloudflare.steamstatic.com' },
      { hostname: 'images.igdb.com' },
      { hostname: '*.ggdeals.com' },
    ],
  },
};

export default nextConfig;
