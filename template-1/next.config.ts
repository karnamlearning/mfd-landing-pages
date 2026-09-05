import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    // Article artwork is served from the Advisorkhoj API host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web-api.advisorkhoj.com",
        pathname: "/common/images/**",
      },
    ],
  },
};

export default nextConfig;
