import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl", "maplibre-gl"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "services.sentinel-hub.com" },
      { protocol: "https", hostname: "data.sentinel-hub.com" },
      { protocol: "https", hostname: "sentinel-hub.com" },
      { protocol: "https", hostname: "dataspace.copernicus.eu" },
    ],
  },
};

export default nextConfig;
