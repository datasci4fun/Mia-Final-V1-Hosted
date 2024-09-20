const path = require("path");

module.exports = {
  mode: "production",
  entry: "./public/chat-widget.js",
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "chat-widget.bundle.js",
    library: "ChatWidget", // Export as a library on the global window object
    libraryTarget: "umd", // Universal Module Definition
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
