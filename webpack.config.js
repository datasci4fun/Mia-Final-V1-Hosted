const path = require('path');

module.exports = {
  mode: 'production', // Use 'production' mode to enable optimizations like minification
  entry: './public/chat-widget.js', // Path to your chat-widget.js file
  output: {
    path: path.resolve(__dirname, 'public/dist'), // Output directory for compiled files
    filename: 'chat-widget.bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude node_modules from compilation
        use: {
          loader: 'babel-loader', // Use Babel to transpile JavaScript
          options: {
            presets: ['@babel/preset-env'], // Preset for modern JavaScript
          },
        },
      },
    ],
  },
};
