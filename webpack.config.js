const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // optional: 'bundle.[contenthash].js' wenn du willst
    publicPath: '', // wichtig für GitHub Pages
    clean: true,
  },
  mode: 'development', // für GitHub Pages kann auch 'production' sinnvoll sein
  devServer: {
    static: './dist',
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/template.html', // erzeugt dist/index.html automatisch
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
