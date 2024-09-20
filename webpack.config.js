const path = require('path');

module.exports = {
  mode: 'production', // Use 'production' mode to enable optimizations like minification
  entry: './public/chat-widget.js', // Path to your chat-widget.js file
  output: {
    path: path.resolve(__dirname, 'public/dist'), // Output directory for compiled files
    filename: 'chat-widget.bundle.js', // Output file name
  },
  resolve: {
    // Resolve JavaScript and JSX file extensions
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Apply this rule to .js, .jsx, .ts, and .tsx files
        exclude: /node_modules/, // Exclude node_modules from compilation
        use: {
          loader: 'babel-loader', // Use Babel to transpile JavaScript and TypeScript
          options: {
            presets: [
              '@babel/preset-env', // Preset for modern JavaScript
              '@babel/preset-react', // Preset to handle React JSX syntax
              '@babel/preset-typescript', // Preset to handle TypeScript
            ],
          },
        },
      },
    ],
  },
};
