const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
});

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
        },
        {
          protocol: "http",
          hostname: "127.0.0.1",
        },
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
      swcMinify: true, // Ensure SWC minification is enabled for faster builds
      appDir: true, // Enable app directory features
    },
    webpack: (config, { isServer }) => {
      // Resolve the SWC vs. Babel conflict
      if (!isServer) {
        // Avoid loading server-specific packages on the client side
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
      return config;
    },
  })
);
