import createNextIntlPlugin from "@workspace/i18n/plugin";
import type { NextConfig } from "next";

// For Tauri static export, configure next-intl without server-side request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Only enable static export for production builds (pnpm build).
  // In dev mode, Next.js runs as a normal server so that middleware and
  // locale routing from next-intl work correctly.
  ...(isDev ? {} : { output: "export" }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@workspace/ui", "@workspace/core", "@workspace/i18n"],
};

export default withNextIntl(nextConfig) as NextConfig;
