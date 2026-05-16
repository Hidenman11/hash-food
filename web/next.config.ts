import type { NextConfig } from "next";

const configuredBackendUrl =
  process.env.BACKEND_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && !configuredBackendUrl) {
  console.warn(
    "BACKEND_URL is not set. Production auth/API requests will not work until the deployed backend URL is configured.",
  );
}

const backendUrl = configuredBackendUrl ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${backendUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
