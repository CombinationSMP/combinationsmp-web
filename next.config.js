/* eslint-disable */

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.node/,
      use: "node-loader",
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "mc-heads.net",
      },
    ],
  },
  experimental: {
    instrumentationHook: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/ws/console",
        destination: "http://localhost:3001",
      },
    ];
  },
};

export default config;
