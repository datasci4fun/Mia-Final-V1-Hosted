// Updated Webpack configuration to include ChatWidget component explicitly
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
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
      swcMinify: true,
      appDir: true,
    },
    webpack: (config, { isServer }) => {
      // Resolve conflicts and ensure proper configuration
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }

      // Ensure the ChatWidget component is part of the entry points
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        // Include the ChatWidget component
        if (
          entries["main.js"] &&
          !entries["main.js"].includes(
            path.resolve(__dirname, "components/ChatWidget.tsx")
          )
        ) {
          entries["main.js"].push(
            path.resolve(__dirname, "components/ChatWidget.tsx")
          );
        }

        return entries;
      };

      // Copy build manifest to public directory
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("CopyBuildManifestPlugin", () => {
            const buildManifestPath = path.join(
              __dirname,
              ".next",
              "build-manifest.json"
            );
            const publicPath = path.join(
              __dirname,
              "public",
              "build-manifest.json"
            );

            try {
              fs.copyFileSync(buildManifestPath, publicPath);
              console.log(
                "Successfully copied build-manifest.json to public directory."
              );
            } catch (error) {
              console.error("Error copying build-manifest.json:", error);
            }
          });
        },
      });

      return config;
    },
    generateBuildId: async () => {
      // Custom build ID
      return `custom-build-${new Date().getTime()}`;
    },
  })
);
