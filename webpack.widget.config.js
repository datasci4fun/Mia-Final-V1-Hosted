const path = require('path');

module.exports = {
  mode: 'production', // 'production' mode for optimizations like minification
  entry: './public/chat-widget.js', // Path to your chat-widget.js
  output: {
    path: path.resolve(__dirname, 'public/dist'), // Output directory
    filename: 'chat-widget.bundle.js', // Name of the output file
    library: 'ChatWidget', // Export as a library to be used on the global window object
    libraryTarget: 'umd', // Universal Module Definition to make it compatible with various module systems
    globalObject: 'this', // Ensures compatibility in different environments (e.g., Node, web)
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply to .js files
        exclude: /node_modules/, // Exclude dependencies
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Transpile ES6+ to ES5
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true, // Minimize the output file size
  },
};
