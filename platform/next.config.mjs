import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Without this, Next.js infers the monorepo root by walking up for the
  // nearest lockfile and finds ~/bun.lock (an unrelated project in the
  // parent home directory), then traces output files across that entire
  // tree — which is enormous and made `next build` hang for minutes.
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // The local SQLite file lives inside this directory (see .env.example).
  // Without this, every DB write changes local.db's mtime, the dev server's
  // file watcher treats that as a source change, and it tears down and
  // remounts the page mid-interaction.
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
        "**/local.db*",
      ],
    };
    return config;
  },
};

export default nextConfig;
