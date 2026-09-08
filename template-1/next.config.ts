import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true, // Displays the entire API URL in the terminal
    },
  }, compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web-api.advisorkhoj.com",
        pathname: "/common/images/**",
      },
      {
        protocol: "https",
        hostname: "www.advisorkhoj.com",
        pathname: "/resources/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    // The investor FAQ became the Mutual Funds explainer; old links still land.
    return [
      { source: "/faqs", destination: "/mutual-funds", permanent: true },
      { source: "/faqs/:path*", destination: "/mutual-funds", permanent: true },
    ];
  },
};

export default nextConfig;
