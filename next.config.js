const fs = require('fs');
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
    webpack: (config, { isServer, buildId }) => {
      // Ensure the consistent use of BUILD_ID for chunk filenames
      const customBuildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();

      // Replace [chunkhash] with the consistent buildId read from the BUILD_ID file
      config.output.filename = config.output.filename.replace(
        '[chunkhash]',
        customBuildId
      );

      config.output.chunkFilename = config.output.chunkFilename.replace(
        '[chunkhash]',
        customBuildId
      );

      // Resolve the SWC vs. Babel conflict and server-side fallbacks
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
      return config;
    },
    generateBuildId: async () => {
      // Use the contents of the BUILD_ID file or provide a default static ID
      const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
      return buildId || 'default-build-id';
    },
  })
);
