const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
});

const fs = require("fs");
const path = require("path");

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
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }

      // Copy the build manifest to the public directory after each build
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("CopyBuildManifestPlugin", () => {
            const buildManifestPath = path.join(__dirname, ".next", "build-manifest.json");
            const publicPath = path.join(__dirname, "public", "build-manifest.json");

            try {
              fs.copyFileSync(buildManifestPath, publicPath);
              console.log("Successfully copied build-manifest.json to public directory.");
            } catch (error) {
              console.error("Error copying build-manifest.json:", error);
            }
          });
        },
      });

      return config;
    },
    generateBuildId: async () => {
      // Generate a custom build ID using the current timestamp
      return `custom-build-${new Date().getTime()}`;
    },
  })
);
